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

const apiRouter = express.Router();

// Health Check
apiRouter.get('/ping', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
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
apiRouter.post('/signup-user', (req, res, next) => {
  try {
  const { username, password, token } = req.body;
  if (token !== TOKEN) {
    return res.status(401).json({ error: 'Token de registro inválido' });
  }

  const users = readDB('users.json');
  if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
    return res.status(400).json({ error: 'El usuario ya existe' });
  }

  // Default role is 'student', status is 'active'
  const newUser = {
    id: Date.now().toString(),
    username,
    password,
    role: 'student',
    status: 'active'
  };
  users.push(newUser);
  writeDB('users.json', users);

  const { password: _, ...userWithoutPassword } = newUser;
  res.json(userWithoutPassword);
  } catch (e) { next(e); }
});

apiRouter.post('/login-user', (req, res, next) => {
  try {
    const { username, password } = req.body;
    const users = readDB('users.json');
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: `Tu cuenta está ${user.status === 'banned' ? 'baneada' : 'pausada'}.` });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (e) { next(e); }
});

// Helper to get user by ID
const getUserById = (id) => {
  const users = readDB('users.json');
  return users.find(u => u.id === id);
};

// Admin Endpoints
apiRouter.get('/admin/users', (req, res, next) => {
  try {
    const { requesterId } = req.query;
    const requester = getUserById(requesterId);
    if (!requester || (requester.role !== 'master' && requester.role !== 'moderator')) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    const users = readDB('users.json');
    // Don't send passwords
    res.json(users.map(({ password: _, ...u }) => u));
  } catch (e) { next(e); }
});

apiRouter.patch('/admin/users/:id', (req, res, next) => {
  try {
    const { requesterId, status, role } = req.body;
    const { id } = req.params;
    const requester = getUserById(requesterId);

    if (!requester || requester.role !== 'master') {
      return res.status(403).json({ error: 'Solo el Master puede gestionar usuarios' });
    }

    const users = readDB('users.json');
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return res.status(404).json({ error: 'Usuario no encontrado' });

    if (status) users[index].status = status;
    if (role) users[index].role = role;

    writeDB('users.json', users);
    const { password: _, ...updatedUser } = users[index];
    res.json(updatedUser);
  } catch (e) { next(e); }
});

apiRouter.delete('/admin/users/:id', (req, res, next) => {
  try {
    const { requesterId } = req.query;
    const { id } = req.params;
    const requester = getUserById(requesterId);

    if (!requester || requester.role !== 'master') {
      return res.status(403).json({ error: 'Solo el Master puede borrar cuentas' });
    }

    let users = readDB('users.json');
    users = users.filter(u => u.id !== id);
    writeDB('users.json', users);
    res.sendStatus(204);
  } catch (e) { next(e); }
});

// Steps API
apiRouter.get('/steps', (req, res, next) => {
  try {
    const steps = readDB('steps.json');
    res.json(steps);
  } catch (e) { next(e); }
});

apiRouter.post('/steps', (req, res, next) => {
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

apiRouter.put('/steps', (req, res, next) => {
  try {
    const { step, userId } = req.body;
    const requester = getUserById(userId);
    let steps = readDB('steps.json');
    const index = steps.findIndex(s => s.id === step.id);

    if (index === -1) return res.status(404).json({ error: 'Paso no encontrado' });

    // Permission: Owner, Moderator or Master
    const canEdit = steps[index].userId === userId || (requester && (requester.role === 'master' || requester.role === 'moderator'));

    if (!canEdit) return res.status(403).json({ error: 'No tienes permiso para editar este paso' });

    steps[index] = { ...step, userId: steps[index].userId, creatorName: steps[index].creatorName };
    writeDB('steps.json', steps);
    res.json(steps[index]);
  } catch (e) { next(e); }
});

apiRouter.delete('/steps/:id', (req, res, next) => {
  try {
    const { userId } = req.query;
    const { id } = req.params;
    const requester = getUserById(userId);
    let steps = readDB('steps.json');
    const stepToDelete = steps.find(s => s.id === id);

    if (!stepToDelete) return res.sendStatus(204);

    const canDelete = stepToDelete.userId === userId || (requester && (requester.role === 'master' || requester.role === 'moderator'));

    if (!canDelete) return res.status(403).json({ error: 'No tienes permiso para borrar este paso' });

    steps = steps.filter(s => s.id !== id);
    writeDB('steps.json', steps);
    res.sendStatus(204);
  } catch (e) { next(e); }
});

// Choreos API
apiRouter.get('/choreos', (req, res, next) => {
  try {
    const choreos = readDB('choreos.json');
    res.json(choreos);
  } catch (e) { next(e); }
});

apiRouter.post('/choreos', (req, res, next) => {
  try {
    const { choreo, userId, username } = req.body;
    const requester = getUserById(userId);
    const choreos = readDB('choreos.json');

    const existingIndex = choreos.findIndex(c => c.id === choreo.id);

    if (existingIndex > -1) {
       // Update logic: Permission Owner, Moderator, Master
       const canEdit = choreos[existingIndex].userId === userId || (requester && (requester.role === 'master' || requester.role === 'moderator'));
       if (!canEdit) return res.status(403).json({ error: 'No tienes permiso para sobreescribir esta coreografía' });

       choreos[existingIndex] = { ...choreo, userId: choreos[existingIndex].userId, creatorName: choreos[existingIndex].creatorName };
       writeDB('choreos.json', choreos);
       return res.json(choreos[existingIndex]);
    }

    // Create logic
    const newChoreo = { ...choreo, id: Date.now().toString(), userId, creatorName: username };
    choreos.push(newChoreo);

    writeDB('choreos.json', choreos);
    res.json(newChoreo);
  } catch (e) { next(e); }
});

apiRouter.delete('/choreos/:id', (req, res, next) => {
  try {
    const { userId } = req.query;
    const { id } = req.params;
    const requester = getUserById(userId);
    let choreos = readDB('choreos.json');
    const choreoToDelete = choreos.find(c => c.id === id);

    if (!choreoToDelete) return res.sendStatus(204);

    const canDelete = choreoToDelete.userId === userId || (requester && (requester.role === 'master' || requester.role === 'moderator'));

    if (!canDelete) return res.status(403).json({ error: 'No tienes permiso para borrar esta coreografía' });

    choreos = choreos.filter(c => c.id !== id);
    writeDB('choreos.json', choreos);
    res.sendStatus(204);
  } catch (e) { next(e); }
});

// Mount the router on both the prefix and the root
app.use('/backend-service', apiRouter);
app.use('/', apiRouter);

// 404 for missing API routes (must be after all API routes but before static files)
apiRouter.use((req, res) => {
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
