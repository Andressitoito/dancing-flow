const express = require('express');
const router = express.Router();
const { readDB, writeDB, getUserById } = require('./db.cjs');

router.get('/', (req, res) => {
  try {
    const choreos = readDB('choreos.json');
    res.json(choreos);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { choreo, userId, username } = req.body;
    const requester = getUserById(userId);
    const choreos = readDB('choreos.json');

    const existingIndex = choreos.findIndex(c => c.id === choreo.id);

    if (existingIndex > -1) {
       const canEdit = choreos[existingIndex].userId === userId || (requester && (requester.role === 'master' || requester.role === 'moderator'));
       if (!canEdit) return res.status(403).json({ error: 'No tienes permiso para sobreescribir esta coreografía' });

       choreos[existingIndex] = { ...choreo, userId: choreos[existingIndex].userId, creatorName: choreos[existingIndex].creatorName };
       writeDB('choreos.json', choreos);
       return res.json(choreos[existingIndex]);
    }

    const newChoreo = { ...choreo, id: Date.now().toString(), userId, creatorName: username };
    choreos.push(newChoreo);
    writeDB('choreos.json', choreos);
    res.json(newChoreo);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', (req, res) => {
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
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
