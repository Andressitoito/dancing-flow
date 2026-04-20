const express = require('express');
const router = express.Router();
const { readDB, writeDB, getUserById } = require('./db.cjs');

router.get('/', (req, res) => {
  try {
    const videos = readDB('videos.json');
    res.json(videos);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { video, userId, username } = req.body;
    const requester = getUserById(userId);

    if (!requester || (requester.role !== 'master' && requester.role !== 'moderator')) {
      return res.status(403).json({ error: 'Solo Masters y Moderadores pueden subir videos' });
    }

    const videos = readDB('videos.json');
    const newVideo = {
      ...video,
      id: Date.now().toString(),
      userId,
      creatorName: username,
      createdAt: new Date().toISOString()
    };
    videos.push(newVideo);
    writeDB('videos.json', videos);
    res.json(newVideo);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const { userId } = req.query;
    const { id } = req.params;
    const requester = getUserById(userId);
    let videos = readDB('videos.json');
    const videoToDelete = videos.find(v => v.id === id);

    if (!videoToDelete) return res.sendStatus(204);

    const canDelete = videoToDelete.userId === userId || (requester && requester.role === 'master');

    if (!canDelete) return res.status(403).json({ error: 'No tienes permiso para borrar este video' });

    videos = videos.filter(v => v.id !== id);
    writeDB('videos.json', videos);
    res.sendStatus(204);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
