const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const TOKEN = "bachata2026";

app.use(cors());
app.use(bodyParser.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const DB_DIR = path.join(__dirname, '..', 'db');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR);
}

const dbPath = (filename) => path.join(DB_DIR, filename);

const readDB = (file) => {
  try {
    if (!fs.existsSync(dbPath(file))) return [];
    return JSON.parse(fs.readFileSync(dbPath(file), 'utf8'));
  } catch (e) {
    console.error(`Error reading ${file}:`, e);
    return [];
  }
};

const writeDB = (file, data) => {
  try {
    fs.writeFileSync(dbPath(file), JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(`Error writing ${file}:`, e);
    throw e;
  }
};

// Auth Endpoints
app.post('/backend-service/signup-user', (req, res, next) => {
  try {
  const { username, password, token } = req.body;
  if (token !== TOKEN) {
    return res.status(401).json({ error: 'Token de registro inválido' });
  }

  const users = readDB('users.json');
  if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
    return res.status(400).json({ error: 'El usuario ya existe' });
  }

  const newUser = { id: Date.now().toString(), username, password, isAdmin: false };
  users.push(newUser);
  writeDB('users.json', users);

  const { password: _, ...userWithoutPassword } = newUser;
  res.json(userWithoutPassword);
  } catch (e) { next(e); }
});

app.post('/backend-service/login-user', (req, res, next) => {
  try {
    const { username, password } = req.body;
    const users = readDB('users.json');
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (e) { next(e); }
});

// Steps API
app.get('/backend-service/steps', (req, res, next) => {
  try {
    const steps = readDB('steps.json');
    res.json(steps);
  } catch (e) { next(e); }
});

app.post('/backend-service/steps', (req, res, next) => {
  try {
    const { step, userId, username } = req.body;
    if (!userId) return res.status(400).json({ error: 'Falta userId' });

    const steps = readDB('steps.json');
    const newStep = { ...step, id: Date.now().toString(), userId, creatorName: username };
    steps.push(newStep);
    writeDB('steps.json', steps);
    res.json(newStep);
  } catch (e) { next(e); }
});

app.put('/backend-service/steps', (req, res, next) => {
  try {
    const { step, userId } = req.body;
    let steps = readDB('steps.json');
    const index = steps.findIndex(s => s.id === step.id && s.userId === userId);
    if (index === -1) return res.status(403).json({ error: 'No autorizado o no encontrado' });

    steps[index] = { ...step, userId };
    writeDB('steps.json', steps);
    res.json(steps[index]);
  } catch (e) { next(e); }
});

app.delete('/backend-service/steps/:id', (req, res, next) => {
  try {
    const { userId } = req.query;
    const { id } = req.params;
    let steps = readDB('steps.json');
    steps = steps.filter(s => !(s.id === id && s.userId === userId));
    writeDB('steps.json', steps);
    res.sendStatus(204);
  } catch (e) { next(e); }
});

// Choreos API
app.get('/backend-service/choreos', (req, res, next) => {
  try {
    const choreos = readDB('choreos.json');
    res.json(choreos);
  } catch (e) { next(e); }
});

app.post('/backend-service/choreos', (req, res, next) => {
  try {
    const { choreo, userId, username } = req.body;
    const choreos = readDB('choreos.json');

    // Create or Update
    const newChoreo = { ...choreo, id: choreo.id || Date.now().toString(), userId, creatorName: username };
    const existingIndex = choreos.findIndex(c => c.id === newChoreo.id && (c.userId === userId || c.id === choreo.id));

    if (existingIndex > -1) {
      choreos[existingIndex] = newChoreo;
    } else {
      choreos.push(newChoreo);
    }

    writeDB('choreos.json', choreos);
    res.json(newChoreo);
  } catch (e) { next(e); }
});

// 404 for missing API routes (must be after all API routes but before static files)
app.use('/backend-service', (req, res) => {
  res.status(404).json({ error: 'Ruta de API no encontrada' });
});

// Seed Initial Steps for Andresito if they don't exist
const seedSteps = [
  { id: 'basic-1', userId: 'andresito', name: 'Paso Básico', duration: 1, description: 'El paso fundamental de la bachata (1 tiempo)', color: '#e11d48', category: 'base' },
  { id: 'basic-2', userId: 'andresito', name: 'Paso Lateral', duration: 2, description: 'Desplazamiento lateral de dos tiempos', color: '#fbbf24', category: 'base' },
  { id: 'giro-derecha', userId: 'andresito', name: 'Giro Derecha', duration: 4, description: 'Giro básico a la derecha en 4 tiempos', color: '#10b981', category: 'giro' }
];

const currentSteps = readDB('steps.json');
if (currentSteps.length === 0) {
  writeDB('steps.json', seedSteps);
}

// Serve static files
const buildPath = path.join(__dirname, '..', 'build');
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));

  // SPA fallback: any route that isn't an API route and didn't match a static file
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// Global Error Handler to return JSON instead of HTML
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`BachataFlow Monolith running on port ${PORT}`);
});
