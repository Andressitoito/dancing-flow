const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { readDB, writeDB } = require('./db.cjs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', '..', 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

router.get('/', (req, res) => {
  res.json(readDB('videos.json'));
});

router.post('/', upload.single('videoFile'), (req, res) => {
  try {
    const { title, subtitle, level, userId, creatorName, url: externalUrl } = req.body;
    let finalUrl = externalUrl;

    if (req.file) {
      finalUrl = `/uploads/${req.file.filename}`;
    }

    const videos = readDB('videos.json');
    const newVideo = {
      id: Date.now().toString(),
      title,
      subtitle: subtitle || '',
      url: finalUrl,
      level,
      userId,
      creatorName,
      likes: [],
      favorites: [],
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
    const { id } = req.params;
    const { userId, role } = req.query;
    let videos = readDB('videos.json');
    const video = videos.find(v => v.id === id);

    if (!video) return res.status(404).json({ error: 'Video no encontrado' });
    if (video.userId !== userId && role !== 'master' && role !== 'moderator') {
      return res.status(403).json({ error: 'No tienes permiso' });
    }

    // Delete file if local
    if (video.url.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', '..', video.url.substring(1));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    videos = videos.filter(v => v.id !== id);
    writeDB('videos.json', videos);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/:id/like', (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const videos = readDB('videos.json');
    const video = videos.find(v => v.id === id);
    if (!video) return res.status(404).json({ error: 'Video no encontrado' });

    if (!video.likes) video.likes = [];
    const index = video.likes.indexOf(userId);
    if (index > -1) {
      video.likes.splice(index, 1);
    } else {
      video.likes.push(userId);
    }

    writeDB('videos.json', videos);
    res.json(video);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/:id/favorite', (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const videos = readDB('videos.json');
    const video = videos.find(v => v.id === id);
    if (!video) return res.status(404).json({ error: 'Video no encontrado' });

    if (!video.favorites) video.favorites = [];
    const index = video.favorites.indexOf(userId);
    if (index > -1) {
      video.favorites.splice(index, 1);
    } else {
      video.favorites.push(userId);
    }

    writeDB('videos.json', videos);
    res.json(video);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
