const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

// Configuration
const BACKUP_DIR = path.join(__dirname, '../backups');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/schoola-taawon';
const MAX_BACKUPS = 7; // Garde une semaine de backups

// Crée le dossier de backup s'il n'existe pas
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Fonction pour supprimer les vieux backups
const cleanOldBackups = () => {
    const files = fs.readdirSync(BACKUP_DIR)
        .map(file => path.join(BACKUP_DIR, file))
        .filter(file => fs.statSync(file).isFile())
        .sort((a, b) => fs.statSync(b).mtime.getTime() - fs.statSync(a).mtime.getTime());

    // Supprime les backups plus anciens que MAX_BACKUPS
    if (files.length > MAX_BACKUPS) {
        files.slice(MAX_BACKUPS).forEach(file => {
            fs.unlinkSync(file);
            logger.info(`Ancien backup supprimé: ${file}`);
        });
    }
};

// Fonction principale de backup
const performBackup = () => {
    const date = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_DIR, `backup-${date}`);

    // Commande mongodump
    const cmd = `mongodump --uri="${MONGODB_URI}" --out="${backupPath}"`;

    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            logger.error('Erreur lors du backup:', error);
            return;
        }

        logger.info(`Backup créé avec succès dans: ${backupPath}`);
        cleanOldBackups();
    });
};

// Exécute le backup
performBackup();

// Pour une utilisation avec cron ou Windows Task Scheduler
if (require.main === module) {
    performBackup();
}