const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('./db.cjs');

// Middleware to check admin/moderator
const checkPrivileges = (req, res, next) => {
  const { adminId } = req.query;
  const users = readDB('users.json');
  const admin = users.find(u => u.id === adminId);
  if (!admin || (admin.role !== 'master' && admin.role !== 'moderator')) {
    return res.status(403).json({ error: 'No tienes permisos de administrador' });
  }
  req.admin = admin;
  next();
};

router.get('/users', checkPrivileges, (req, res) => {
  const users = readDB('users.json');
  res.json(users.map(({ password, ...u }) => u));
});

router.put('/users/:id', checkPrivileges, (req, res) => {
  try {
    const { id } = req.params;
    const { role, status } = req.body;
    const users = readDB('users.json');
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Only master can change roles
    if (role && req.admin.role !== 'master') {
      return res.status(403).json({ error: 'Solo el master puede cambiar roles' });
    }

    users[userIndex] = { ...users[userIndex], ...req.body };
    writeDB('users.json', users);
    const { password, ...userWithoutPassword } = users[userIndex];
    res.json(userWithoutPassword);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/users/:id', checkPrivileges, (req, res) => {
  try {
    const { id } = req.params;
    if (req.admin.role !== 'master') return res.status(403).json({ error: 'Solo el master puede eliminar cuentas' });

    let users = readDB('users.json');
    users = users.filter(u => u.id !== id);
    writeDB('users.json', users);

    // Also delete their steps
    let steps = readDB('steps.json');
    steps = steps.filter(s => s.userId !== id);
    writeDB('steps.json', steps);

    // Keep choreos, but they become "orphaned" (userId exists but account doesn't)
    // Master can see them in a special filter if we want, or just leave them.

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Master cleanup: Delete choreos with no valid owner
router.delete('/cleanup-choreos', checkPrivileges, (req, res) => {
  try {
    if (req.admin.role !== 'master') return res.status(403).json({ error: 'Solo master' });

    const users = readDB('users.json');
    const userIds = new Set(users.map(u => u.id));

    let choreos = readDB('choreos.json');
    const beforeCount = choreos.length;
    choreos = choreos.filter(c => userIds.has(c.userId) || c.userId === 'system' || c.userId === 'andresito');
    const afterCount = choreos.length;

    writeDB('choreos.json', choreos);
    res.json({ deleted: beforeCount - afterCount });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
