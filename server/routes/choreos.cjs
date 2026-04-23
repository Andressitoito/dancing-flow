const express = require('express');
const router = express.Router();
const { readDB, writeDB, getUserById } = require('./db.cjs');

router.get('/', (req, res) => {
  res.json(readDB('choreos.json'));
});

router.post('/', (req, res) => {
  try {
    const { id, title, sequence, measures, userId, creatorName, isPublic } = req.body;
    const requester = getUserById(userId);
    const choreos = readDB('choreos.json');

    let choreo;
    if (id) {
      const index = choreos.findIndex(c => c.id === id);
      if (index !== -1) {
        // Only allow update if same user or admin
        const canEdit = choreos[index].userId === userId || (requester && (requester.role === 'master' || requester.role === 'moderator'));
        if (canEdit) {
          choreos[index] = {
            ...choreos[index],
            title,
            sequence,
            measures,
            isPublic: isPublic !== undefined ? isPublic : choreos[index].isPublic
          };
          choreo = choreos[index];
        } else {
          return res.status(403).json({ error: 'No tienes permiso para editar' });
        }
      }
    }

    if (!choreo) {
      choreo = {
        id: Date.now().toString(),
        title,
        sequence,
        measures,
        userId,
        creatorName,
        isPublic: isPublic !== undefined ? isPublic : true,
        likes: [],
        favorites: [],
        createdAt: new Date().toISOString()
      };
      choreos.push(choreo);
    }

    writeDB('choreos.json', choreos);
    res.json(choreo);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    const requester = getUserById(userId);
    let choreos = readDB('choreos.json');
    const choreo = choreos.find(c => c.id === id);

    if (!choreo) return res.status(404).json({ error: 'No encontrado' });
    const canDelete = choreo.userId === userId || (requester && (requester.role === 'master' || requester.role === 'moderator'));
    if (!canDelete) {
      return res.status(403).json({ error: 'No tienes permiso' });
    }

    choreos = choreos.filter(c => c.id !== id);
    writeDB('choreos.json', choreos);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/:id/like', (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const choreos = readDB('choreos.json');
    const choreo = choreos.find(c => c.id === id);
    if (!choreo) return res.status(404).json({ error: 'Choreo no encontrado' });

    if (!choreo.likes) choreo.likes = [];
    const index = choreo.likes.indexOf(userId);
    if (index > -1) {
      choreo.likes.splice(index, 1);
    } else {
      choreo.likes.push(userId);
    }

    writeDB('choreos.json', choreos);
    res.json(choreo);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/:id/favorite', (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const choreos = readDB('choreos.json');
    const choreo = choreos.find(c => c.id === id);
    if (!choreo) return res.status(404).json({ error: 'Choreo no encontrado' });

    if (!choreo.favorites) choreo.favorites = [];
    const index = choreo.favorites.indexOf(userId);
    if (index > -1) {
      choreo.favorites.splice(index, 1);
    } else {
      choreo.favorites.push(userId);
    }

    writeDB('choreos.json', choreos);
    res.json(choreo);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
