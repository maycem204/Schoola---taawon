# 🚀 Guide de déploiement - Schoola-Taawon

## 📋 Prérequis

### Serveur
- Node.js 16+ et npm
- MongoDB 4.4+
- PM2 (pour la production)
- Nginx (recommandé)
- Certificat SSL (Let's Encrypt)

### Domaine
- Nom de domaine configuré
- DNS pointant vers votre serveur

---

## 🔧 Configuration de production

### 1. Variables d'environnement

**Backend (`server/.env.production`):**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/schoola-taawon
JWT_SECRET=votre_secret_jwt_tres_securise_et_long_minimum_32_caracteres
CLIENT_URL=https://votre-domaine.com
```

**Frontend (`client/.env.production`):**
```env
REACT_APP_API_URL=https://api.votre-domaine.com
```

---

## 📦 Déploiement Backend

### Étape 1 : Préparer le serveur

```bash
# Se connecter au serveur
ssh user@votre-serveur.com

# Créer le dossier de l'application
mkdir -p /var/www/schoola-taawon
cd /var/www/schoola-taawon

# Cloner le repository
git clone <votre-repo-url> .

# Installer les dépendances backend
cd server
npm install --production
```

### Étape 2 : Configurer PM2

```bash
# Installer PM2 globalement
npm install -g pm2

# Créer le fichier ecosystem
```

**Fichier `ecosystem.config.js` :**
```javascript
module.exports = {
  apps: [{
    name: 'schoola-taawon-api',
    script: './server/index.js',
    instances: 2,
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
```

### Étape 3 : Démarrer l'application

```bash
# Démarrer avec PM2
pm2 start ecosystem.config.js --env production

# Sauvegarder la configuration
pm2 save

# Configurer le démarrage automatique
pm2 startup
```

---

## 🌐 Déploiement Frontend

### Étape 1 : Build de production

```bash
# Sur votre machine locale
cd client
npm run build
```

### Étape 2 : Transférer les fichiers

```bash
# Copier le build vers le serveur
scp -r build/* user@votre-serveur.com:/var/www/schoola-taawon/client/build/
```

### Étape 3 : Configurer Nginx

**Fichier `/etc/nginx/sites-available/schoola-taawon` :**

```nginx
# Redirection HTTP vers HTTPS
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;
    return 301 https://$server_name$request_uri;
}

# Frontend
server {
    listen 443 ssl http2;
    server_name votre-domaine.com www.votre-domaine.com;

    ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;

    root /var/www/schoola-taawon/client/build;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache des assets statiques
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# API Backend
server {
    listen 443 ssl http2;
    server_name api.votre-domaine.com;

    ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.IO
    location /socket.io/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Étape 4 : Activer le site

```bash
# Créer le lien symbolique
sudo ln -s /etc/nginx/sites-available/schoola-taawon /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Recharger Nginx
sudo systemctl reload nginx
```

---

## 🔒 Certificat SSL (Let's Encrypt)

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx

# Obtenir le certificat
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com -d api.votre-domaine.com

# Renouvellement automatique (déjà configuré)
sudo certbot renew --dry-run
```

---

## 💾 Configuration MongoDB

### Sécuriser MongoDB

```bash
# Se connecter à MongoDB
mongosh

# Créer un utilisateur admin
use admin
db.createUser({
  user: "admin",
  pwd: "mot_de_passe_securise",
  roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]
})

# Créer un utilisateur pour l'application
use schoola-taawon
db.createUser({
  user: "schoola_user",
  pwd: "mot_de_passe_app",
  roles: ["readWrite"]
})
```

**Modifier `/etc/mongod.conf` :**
```yaml
security:
  authorization: enabled

net:
  bindIp: 127.0.0.1
```

**Redémarrer MongoDB :**
```bash
sudo systemctl restart mongod
```

**Mettre à jour MONGODB_URI :**
```env
MONGODB_URI=mongodb://schoola_user:mot_de_passe_app@localhost:27017/schoola-taawon
```

---

## 🔄 Mises à jour

### Déployer une nouvelle version

```bash
# Sur le serveur
cd /var/www/schoola-taawon

# Sauvegarder la base de données
mongodump --db schoola-taawon --out ./backup/$(date +%Y%m%d)

# Récupérer les derniers changements
git pull origin main

# Backend
cd server
npm install --production
pm2 restart schoola-taawon-api

# Frontend (build sur votre machine locale puis upload)
# Ou build sur le serveur:
cd ../client
npm install
npm run build
```

---

## 📊 Monitoring

### Commandes PM2 utiles

```bash
# Voir le statut
pm2 status

# Voir les logs
pm2 logs schoola-taawon-api

# Voir les logs en temps réel
pm2 logs schoola-taawon-api --lines 100

# Monitoring
pm2 monit

# Redémarrer
pm2 restart schoola-taawon-api

# Arrêter
pm2 stop schoola-taawon-api

# Supprimer
pm2 delete schoola-taawon-api
```

### Logs Nginx

```bash
# Logs d'accès
sudo tail -f /var/log/nginx/access.log

# Logs d'erreur
sudo tail -f /var/log/nginx/error.log
```

---

## 🔐 Sécurité

### Firewall (UFW)

```bash
# Activer UFW
sudo ufw enable

# Autoriser SSH
sudo ufw allow 22/tcp

# Autoriser HTTP et HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Vérifier le statut
sudo ufw status
```

### Fail2Ban

```bash
# Installer Fail2Ban
sudo apt install fail2ban

# Configurer
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Démarrer
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

---

## 📈 Optimisations

### 1. Compression Gzip (déjà dans Nginx)

### 2. Cache Redis (optionnel)

```bash
# Installer Redis
sudo apt install redis-server

# Configurer dans le backend
npm install redis
```

### 3. CDN pour les images (optionnel)

Utiliser Cloudflare ou AWS CloudFront pour servir les images.

---

## 🧪 Tests de production

### Vérifier que tout fonctionne

```bash
# Test API
curl https://api.votre-domaine.com/api/health

# Test Socket.IO
curl https://api.votre-domaine.com/socket.io/

# Test Frontend
curl https://votre-domaine.com
```

### Tests de charge (optionnel)

```bash
# Installer Apache Bench
sudo apt install apache2-utils

# Test
ab -n 1000 -c 10 https://api.votre-domaine.com/api/listings
```

---

## 🔄 Backup automatique

**Script `backup.sh` :**

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/schoola-taawon"

# Créer le dossier de backup
mkdir -p $BACKUP_DIR

# Backup MongoDB
mongodump --db schoola-taawon --out $BACKUP_DIR/mongo_$DATE

# Backup des uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/schoola-taawon/server/uploads

# Garder seulement les 7 derniers backups
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
```

**Ajouter au crontab :**
```bash
# Éditer le crontab
crontab -e

# Ajouter (backup tous les jours à 2h du matin)
0 2 * * * /var/www/schoola-taawon/backup.sh
```

---

## 📞 Dépannage

### L'API ne répond pas

```bash
# Vérifier PM2
pm2 status
pm2 logs

# Vérifier MongoDB
sudo systemctl status mongod

# Vérifier les ports
sudo netstat -tulpn | grep :5000
```

### Le frontend ne charge pas

```bash
# Vérifier Nginx
sudo nginx -t
sudo systemctl status nginx

# Vérifier les logs
sudo tail -f /var/log/nginx/error.log
```

### Socket.IO ne fonctionne pas

- Vérifier la configuration Nginx pour `/socket.io/`
- Vérifier que les WebSockets sont autorisés
- Vérifier les CORS dans le backend

---

## ✅ Checklist finale

- [ ] Variables d'environnement configurées
- [ ] MongoDB sécurisé avec authentification
- [ ] Backend déployé avec PM2
- [ ] Frontend buildé et servi par Nginx
- [ ] Certificat SSL installé
- [ ] Firewall configuré
- [ ] Backups automatiques configurés
- [ ] Monitoring en place
- [ ] Tests de production effectués
- [ ] DNS configuré correctement

---

## 📚 Ressources

- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [MongoDB Security](https://docs.mongodb.com/manual/security/)

---

**Version** : 1.1.0  
**Date** : 7 novembre 2024  
**Statut** : Prêt pour la production
