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

const dbPath = (filename) => path.join(__dirname, '..', 'db', filename);

const readDB = (file) => {
  try {
    return JSON.parse(fs.readFileSync(dbPath(file), 'utf8'));
  } catch (e) {
    return [];
  }
};
const writeDB = (file, data) => fs.writeFileSync(dbPath(file), JSON.stringify(data, null, 2));

// Auth Endpoints
app.post('/api/register', (req, res) => {
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
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const users = readDB('users.json');
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Steps API
app.get('/api/steps', (req, res) => {
  const { userId } = req.query;
  const steps = readDB('steps.json');
  const filteredSteps = steps.filter(s => s.userId === 'andresito' || s.userId === userId);
  res.json(filteredSteps);
});

app.post('/api/steps', (req, res) => {
  const { step, userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'Falta userId' });

  const steps = readDB('steps.json');
  const newStep = { ...step, id: Date.now().toString(), userId };
  steps.push(newStep);
  writeDB('steps.json', steps);
  res.json(newStep);
});

app.put('/api/steps', (req, res) => {
  const { step, userId } = req.body;
  let steps = readDB('steps.json');
  const index = steps.findIndex(s => s.id === step.id && s.userId === userId);
  if (index === -1) return res.status(403).json({ error: 'No autorizado o no encontrado' });

  steps[index] = { ...step, userId };
  writeDB('steps.json', steps);
  res.json(steps[index]);
});

app.delete('/api/steps/:id', (req, res) => {
  const { userId } = req.query;
  const { id } = req.params;
  let steps = readDB('steps.json');
  steps = steps.filter(s => !(s.id === id && s.userId === userId));
  writeDB('steps.json', steps);
  res.sendStatus(204);
});

// Choreos API
app.get('/api/choreos', (req, res) => {
  const { userId } = req.query;
  const choreos = readDB('choreos.json');
  const filteredChoreos = choreos.filter(c => c.userId === 'andresito' || c.userId === userId);
  res.json(filteredChoreos);
});

app.post('/api/choreos', (req, res) => {
  const { choreo, userId } = req.body;
  const choreos = readDB('choreos.json');

  // Create or Update
  const newChoreo = { ...choreo, id: choreo.id || Date.now().toString(), userId };
  const existingIndex = choreos.findIndex(c => c.id === newChoreo.id && c.userId === userId);

  if (existingIndex > -1) {
    choreos[existingIndex] = newChoreo;
  } else {
    choreos.push(newChoreo);
  }

  writeDB('choreos.json', choreos);
  res.json(newChoreo);
});

// Serve static files
const buildPath = path.join(__dirname, '..', 'build');
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`BachataFlow Monolith running on port ${PORT}`);
});
