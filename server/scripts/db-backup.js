const { MongoClient } = require('mongodb');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

// Configuration
require('dotenv').config();

const config = {
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/schoola-taawon',
        dbName: 'schoola-taawon'
    },
    backup: {
        dir: path.join(__dirname, '../backups'),
        keepLast: 7 // Garder les 7 derniers backups
    }
};

// Assurez-vous que le dossier de backup existe
if (!fs.existsSync(config.backup.dir)) {
    fs.mkdirSync(config.backup.dir, { recursive: true });
}

async function createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(config.backup.dir, `backup-${timestamp}.json`);
    const client = await MongoClient.connect(config.mongodb.uri);
    
    try {
        console.log('Connexion à la base de données...');
        const db = client.db(config.mongodb.dbName);
        
        // Récupérer toutes les collections
        const collections = await db.listCollections().toArray();
        const backup = {};

        // Pour chaque collection, récupérer toutes les données
        for (const collection of collections) {
            console.log(`Sauvegarde de la collection ${collection.name}...`);
            const data = await db.collection(collection.name).find({}).toArray();
            backup[collection.name] = data;
        }

        // Écrire le fichier de backup
        fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
        console.log(`Backup créé: ${backupPath}`);

        // Compresser le backup
        const archive = archiver('zip', { zlib: { level: 9 } });
        const zipPath = `${backupPath}.zip`;
        const output = fs.createWriteStream(zipPath);

        return new Promise((resolve, reject) => {
            output.on('close', () => {
                // Supprimer le fichier JSON non compressé
                fs.unlinkSync(backupPath);
                console.log(`Backup compressé créé: ${zipPath}`);
                cleanOldBackups();
                resolve(zipPath);
            });

            archive.on('error', reject);
            archive.pipe(output);
            archive.file(backupPath, { name: path.basename(backupPath) });
            archive.finalize();
        });

    } catch (error) {
        console.error('Erreur lors du backup:', error);
        throw error;
    } finally {
        await client.close();
    }
}

function cleanOldBackups() {
    const files = fs.readdirSync(config.backup.dir)
        .filter(file => file.endsWith('.zip'))
        .map(file => ({
            name: file,
            path: path.join(config.backup.dir, file),
            time: fs.statSync(path.join(config.backup.dir, file)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time);

    // Supprimer les backups plus anciens que la limite
    if (files.length > config.backup.keepLast) {
        files.slice(config.backup.keepLast).forEach(file => {
            fs.unlinkSync(file.path);
            console.log(`Ancien backup supprimé: ${file.name}`);
        });
    }
}

// Si le script est exécuté directement
if (require.main === module) {
    createBackup().catch(error => {
        console.error('Erreur fatale:', error);
        process.exit(1);
    });
}

module.exports = { createBackup };