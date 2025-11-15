module.exports = {
  apps: [
    {
      name: 'schoola-taawon-api',
      script: 'index.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
        PORT: 5001,
        MONGODB_URI: 'mongodb+srv://admin:admin123@cluster0.fxf9ie1.mongodb.net/schoola-taawon?retryWrites=true&w=majority&appName=Cluster0',
        JWT_SECRET: 'schoola-taawon-secret-key-2025',
        CLIENT_URL: 'http://localhost:3000'
      }
    }
  ]
}