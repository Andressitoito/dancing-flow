const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { readDB, writeDB, getUserById } = require('./db.cjs');

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

router.get('/', (req, res) => {
  try {
    const videos = readDB('videos.json');
    res.json(videos);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', upload.single('videoFile'), (req, res) => {
  try {
    const { title, level, userId, username, url } = req.body;
    const requester = getUserById(userId);

    if (!requester || (requester.role !== 'master' && requester.role !== 'moderator')) {
      return res.status(403).json({ error: 'Solo Masters y Moderadores pueden subir videos' });
    }

    let finalUrl = url;
    if (req.file) {
      finalUrl = `/uploads/${req.file.filename}`;
    }

    if (!finalUrl) return res.status(400).json({ error: 'URL o archivo de video requerido' });

    const videos = readDB('videos.json');
    const newVideo = {
      id: Date.now().toString(),
      title,
      level,
      url: finalUrl,
      userId,
      creatorName: username,
      createdAt: new Date().toISOString(),
      isLocal: !!req.file
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

    // Delete file if local
    if (videoToDelete.isLocal) {
       const fileName = videoToDelete.url.split('/').pop();
       const filePath = path.join(__dirname, '..', '..', 'uploads', fileName);
       if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    videos = videos.filter(v => v.id !== id);
    writeDB('videos.json', videos);
    res.sendStatus(204);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
