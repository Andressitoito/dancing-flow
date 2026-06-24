require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const initDB = require('./init-db.cjs');

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

// Routes
const authRoutes = require('./routes/auth.cjs');
const userRoutes = require('./routes/users.cjs');
const studyRoutes = require('./routes/study.cjs');
const adminRoutes = require('./routes/admin.cjs');

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
  });

  socket.on('send_message', (data) => {
    io.to(`assignment_${data.assignmentId}`).emit('new_message', data);
  });
});

// Fallback to React
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

const PORT = process.env.PORT || 3001;

initDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Critical Error: Failed to start server due to database initialization failure.');
  process.exit(1);
});
