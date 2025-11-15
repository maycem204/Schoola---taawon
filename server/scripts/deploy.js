const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
    server: {
        dir: path.join(__dirname, '..'),
        envFile: '.env.production'
    },
    client: {
        dir: path.join(__dirname, '../../client'),
        buildDir: 'build'
    },
    pm2: {
        appName: 'schoola-taawon'
    }
};

async function deploy() {
    try {
        console.log('🚀 Démarrage du déploiement...');

        // 1. Vérifier que nous sommes en production
        process.env.NODE_ENV = 'production';

        // 2. Construction du client
        console.log('📦 Construction du client...');
        execSync('npm run build', { cwd: config.client.dir, stdio: 'inherit' });

        // 3. Installation des dépendances de production du serveur
        console.log('📦 Installation des dépendances du serveur...');
        execSync('npm ci --only=production', { cwd: config.server.dir, stdio: 'inherit' });

        // 4. Vérification des variables d'environnement
        if (!fs.existsSync(path.join(config.server.dir, config.server.envFile))) {
            throw new Error(`Fichier ${config.server.envFile} manquant`);
        }

        // 5. Création des dossiers nécessaires
        const dirs = ['logs', 'uploads', 'backups'];
        dirs.forEach(dir => {
            const dirPath = path.join(config.server.dir, dir);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }
        });

        // 6. Configuration de PM2
        console.log('⚙️ Configuration de PM2...');
        const pm2Config = {
            name: config.pm2.appName,
            script: './index.js',
            cwd: config.server.dir,
            env_production: {
                NODE_ENV: 'production'
            },
            instances: 'max',
            exec_mode: 'cluster',
            max_memory_restart: '300M',
            out_file: path.join(config.server.dir, 'logs/out.log'),
            error_file: path.join(config.server.dir, 'logs/error.log'),
            merge_logs: true,
            log_date_format: 'YYYY-MM-DD HH:mm:ss'
        };

        fs.writeFileSync(
            path.join(config.server.dir, 'ecosystem.config.json'),
            JSON.stringify(pm2Config, null, 2)
        );

        // 7. Démarrage de l'application
        console.log('🚀 Démarrage de l\'application...');
        execSync('pm2 delete schoola-taawon || true', { stdio: 'inherit' });
        execSync('pm2 start ecosystem.config.json --env production', { 
            cwd: config.server.dir,
            stdio: 'inherit'
        });

        console.log('✅ Déploiement terminé avec succès!');
        console.log('Pour surveiller l\'application:');
        console.log('- pm2 monit');
        console.log('- pm2 logs schoola-taawon');

    } catch (error) {
        console.error('❌ Erreur lors du déploiement:', error);
        process.exit(1);
    }
}

// Exécuter le déploiement si le script est appelé directement
if (require.main === module) {
    deploy();
}

module.exports = deploy;