const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Routes
const authRoutes = require('./routes/auth.cjs');
const stepsRoutes = require('./routes/steps.cjs');
const choreosRoutes = require('./routes/choreos.cjs');
const adminRoutes = require('./routes/admin.cjs');
const videoRoutes = require('./routes/videos.cjs');

app.use(cors());
app.use(bodyParser.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const { readDB, writeDB } = require('./routes/db.cjs');

// Seed Initial Steps
const seedSteps = [
  { id: 'basic-1', userId: 'andresito', name: 'Paso Básico', duration: 1, description: 'El paso fundamental de la bachata (1 tiempo)', color: '#e11d48', category: 'base' },
  { id: 'basic-2', userId: 'andresito', name: 'Paso Lateral', duration: 2, description: 'Desplazamiento lateral de dos tiempos', color: '#fbbf24', category: 'base' },
  { id: 'giro-derecha', userId: 'andresito', name: 'Giro Derecha', duration: 4, description: 'Giro básico a la derecha en 4 tiempos', color: '#10b981', category: 'giro' }
];

if (readDB('steps.json').length === 0) {
  writeDB('steps.json', seedSteps);
}

if (readDB('videos.json').length === 0) {
  writeDB('videos.json', [
    {
      id: 'demo-video',
      title: 'Demo de Bienvenida',
      url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      level: 'principiante',
      userId: 'system',
      creatorName: 'Dancing Flow'
    }
  ]);
}

const apiRouter = express.Router();

// Health Check
apiRouter.get('/ping', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
apiRouter.use('/', authRoutes);
apiRouter.use('/steps', stepsRoutes);
apiRouter.use('/choreos', choreosRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/videos', videoRoutes);

// Mount the router on both the prefix and the root
app.use('/backend-service', apiRouter);
app.use('/', apiRouter);

// Serve static files
const buildPath = path.join(__dirname, '..', 'build');
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));

  // SPA fallback: any route that isn't an API route and didn't match a static file
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Dancing Flow Monolith running on port ${PORT}`);
});
