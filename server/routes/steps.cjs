const express = require('express');
const router = express.Router();
const { readDB, writeDB, getUserById } = require('./db.cjs');

router.get('/', (req, res) => {
  try {
    const steps = readDB('steps.json');
    res.json(steps);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { step, userId, username } = req.body;
    if (!userId) return res.status(400).json({ error: 'Falta userId' });

    const steps = readDB('steps.json');
    const newStep = { ...step, id: Date.now().toString(), userId, creatorName: username };
    steps.push(newStep);
    writeDB('steps.json', steps);
    res.json(newStep);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const { step, userId } = req.body;
    const { id } = req.params;
    const requester = getUserById(userId);
    let steps = readDB('steps.json');
    const index = steps.findIndex(s => s.id === id || s.id === step.id);

    if (index === -1) return res.status(404).json({ error: 'Paso no encontrado' });

    const canEdit = steps[index].userId === userId || (requester && (requester.role === 'master' || requester.role === 'moderator'));

    if (!canEdit) return res.status(403).json({ error: 'No tienes permiso para editar este paso' });

    steps[index] = { ...step, userId: steps[index].userId, creatorName: steps[index].creatorName };
    writeDB('steps.json', steps);
    res.json(steps[index]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', (req, res) => {
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
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
