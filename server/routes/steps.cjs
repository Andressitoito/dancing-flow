const express = require('express');
const router = express.Router();
const { readDB, writeDB, getUserById } = require('./db.cjs');

router.get('/', (req, res) => {
  res.json(readDB('steps.json'));
});

router.post('/', (req, res) => {
  try {
    const { id, name, duration, description, color, category, userId } = req.body;
    const requester = getUserById(userId);
    const steps = readDB('steps.json');

    let step;
    if (id) {
      const index = steps.findIndex(s => s.id === id);
      if (index !== -1) {
        // Permission check: only creator or admin
        const canEdit = steps[index].userId === userId || (requester && (requester.role === 'master' || requester.role === 'moderator'));
        if (canEdit) {
          steps[index] = {
            ...steps[index],
            name,
            duration,
            description,
            color,
            category
          };
          step = steps[index];
        } else {
          return res.status(403).json({ error: 'No tienes permiso para editar este paso' });
        }
      }
    }

    if (!step) {
      step = {
        id: Date.now().toString(),
        name,
        duration: duration || 1,
        description: description || '',
        color: color || '#e11d48',
        category: category || 'base',
        userId,
        createdAt: new Date().toISOString()
      };
      steps.push(step);
    }

    writeDB('steps.json', steps);
    res.json(step);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    const requester = getUserById(userId);
    let steps = readDB('steps.json');
    const step = steps.find(s => s.id === id);

    if (!step) return res.status(404).json({ error: 'Paso no encontrado' });
    const canDelete = step.userId === userId || (requester && (requester.role === 'master' || requester.role === 'moderator'));
    if (!canDelete) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este paso' });
    }

    steps = steps.filter(s => s.id !== id);
    writeDB('steps.json', steps);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
