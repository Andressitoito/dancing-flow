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
const buildPath = path.join(__dirname, '../dist');
app.use(express.static(buildPath));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes (to be implemented)
const authRoutes = require('./routes/auth.cjs');
const userRoutes = require('./routes/users.cjs');
const studyRoutes = require('./routes/study.cjs');

// Register routes both with and without prefix to support different Nginx proxy configurations
const registerRoutes = (path, router) => {
  app.use(path, router);
  app.use(`/backend-service${path}`, router);
};

registerRoutes('/auth', authRoutes);
registerRoutes('/users', userRoutes);
registerRoutes('/study', studyRoutes);

// Socket.io logic
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('authenticate', (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit('online_users', Array.from(onlineUsers.keys()));
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
    // In a production app, you'd use rooms for privacy (socket.to(assignmentId).emit(...))
    // For now, we emit to everyone and filter client-side for simplicity in this MVP
    io.emit('new_message', data);
  });
});

// Fallback to React
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

const PORT = process.env.PORT || 3001;

sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
