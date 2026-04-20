const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('./db.cjs');

const TOKEN = "bachata2026";

router.post('/signup-user', (req, res) => {
  try {
    const { username, password, token } = req.body;
    if (token !== TOKEN) {
      return res.status(401).json({ error: 'Token de registro inválido' });
    }

    const users = readDB('users.json');
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

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
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/login-user', (req, res) => {
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
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
