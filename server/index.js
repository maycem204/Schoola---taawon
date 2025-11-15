require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
  }
});

// Make io available in controllers via req.app.get('io')
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB Local (Compass)
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/schoola-taawon';

const connectDB = async () => {
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

// Attendre la connexion MongoDB avant de continuer
connectDB()
  .then(() => {
    console.log('✅ MongoDB connecté avec succès');
    
    // Routes (uniquement après connexion MongoDB)
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/listings', require('./routes/listings'));
    app.use('/api/messages', require('./routes/messages'));
    app.use('/api/likes', require('./routes/likes'));
    app.use('/api/notifications', require('./routes/notifications'));
    app.use('/api/users', require('./routes/user.routes'));
    app.use('/api/test-notification', require('./routes/test-notification'));

    // Socket.IO connection handling
    io.on('connection', (socket) => {
      console.log('A user connected');
      
      // Rejoindre automatiquement une room avec le userId pour les notifications
      const userId = socket.handshake.auth.token;
      if (userId) {
        socket.join(userId);
        console.log(`User ${userId} joined their notification room`);
      }

      socket.on('join', (conversationId) => {
        socket.join(conversationId);
      });

      socket.on('message', async (data) => {
        io.to(data.conversationId).emit('message', data);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Something broke!');
    });

    const PORT = process.env.PORT || 5001;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ ERREUR CRITIQUE: Impossible de se connecter à MongoDB');
    console.error('Message:', err.message);
    console.log('\n⚠️  SOLUTIONS:');
    console.log('1. MongoDB local: mongodb://localhost:27017/schoola-taawon');
    console.log('2. MongoDB Atlas: Copiez votre URI dans .env');
    console.log('\n❌ Le serveur va s\'arrêter...\n');
    process.exit(1);
  });
