const express = require('express');
const router = express.Router();
const { readDB, writeDB, getUserById } = require('./db.cjs');

router.get('/users', (req, res) => {
  try {
    const { requesterId } = req.query;
    const requester = getUserById(requesterId);
    if (!requester || (requester.role !== 'master' && requester.role !== 'moderator')) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    const users = readDB('users.json');
    res.json(users.map(({ password: _, ...u }) => u));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.patch('/users/:id', (req, res) => {
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
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/users/:id', (req, res) => {
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
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
