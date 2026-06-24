require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database.cjs');
require('./models/index.cjs'); // Initialize associations

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
const buildPath = path.join(__dirname, '../build');
app.use(express.static(buildPath));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes (to be implemented)
const authRoutes = require('./routes/auth.cjs');
const userRoutes = require('./routes/users.cjs');
const studyRoutes = require('./routes/study.cjs');
const adminRoutes = require('./routes/admin.cjs');

// Register routes both with and without prefix to support different Nginx proxy configurations
const registerRoutes = (path, router) => {
  app.use(path, router);
  app.use(`/backend-service${path}`, router);
};

registerRoutes('/auth', authRoutes);
registerRoutes('/users', userRoutes);
registerRoutes('/study', studyRoutes);
registerRoutes('/admin', adminRoutes);

// Health check
app.get('/ping', (req, res) => res.json({ status: 'ok', time: new Date() }));
app.get('/backend-service/ping', (req, res) => res.json({ status: 'ok', time: new Date() }));

// Socket.io logic
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('authenticate', (userId) => {
    socket.userId = userId;
    onlineUsers.set(userId, socket.id);
    io.emit('online_users', Array.from(onlineUsers.keys()));
  });

  socket.on('join_assignment', (assignmentId) => {
    socket.join(`assignment_${assignmentId}`);
  });

  socket.on('disconnect', () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit('online_users', Array.from(onlineUsers.keys()));
    console.log('User disconnected');
  });

  socket.on('send_message', (data) => {
    // Emit to specific assignment room for privacy
    io.to(`assignment_${data.assignmentId}`).emit('new_message', data);
  });
});

// Fallback to React
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Basic sync
    await sequelize.authenticate();
    console.log('Database connection successful');

    // Robust column check/migration for Users table
    const queryInterface = sequelize.getQueryInterface();
    const tableInfo = await queryInterface.describeTable('Users').catch(() => ({}));

    // Check and add isPro
    if (tableInfo.id && !tableInfo.isPro) {
      console.log('Adding missing isPro column...');
      await queryInterface.addColumn('Users', 'isPro', {
        type: require('sequelize').DataTypes.BOOLEAN,
        defaultValue: false
      });
    }

    // Check and add level
    if (tableInfo.id && !tableInfo.level) {
      console.log('Adding missing level column...');
      await queryInterface.addColumn('Users', 'level', {
        type: require('sequelize').DataTypes.ENUM('principiante', 'pre-intermedio', 'intermedio', 'avanzado'),
        allowNull: true
      });
    }

    // Final sync for other models
    await sequelize.sync({ alter: true });
    console.log('Database synced');

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
