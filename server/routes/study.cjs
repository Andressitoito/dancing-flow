const express = require('express');
const router = express.Router();
const { StudyBlock, Assignment, Reply, User } = require('../models/index.cjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/content';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Create Study Block (Admin)
router.post('/blocks', upload.single('file'), async (req, res) => {
  try {
    const { title, description, type, level, creatorId } = req.body;
    const block = await StudyBlock.create({
      title,
      description,
      type,
      level,
      creatorId,
      contentUrl: req.file ? `/uploads/content/${req.file.filename}` : null
    });
    res.json(block);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Assign to students (Admin)
router.post('/assignments', async (req, res) => {
  try {
    const { studyBlockId, userIds } = req.body;
    const assignments = await Promise.all(userIds.map(userId =>
      Assignment.findOrCreate({ where: { studyBlockId, userId } })
    ));
    res.json(assignments);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get blocks for a student
router.get('/my-assignments', async (req, res) => {
  try {
    const { userId } = req.query;
    const assignments = await Assignment.findAll({
      where: { userId },
      include: [
        { model: StudyBlock },
        {
          model: Reply,
          include: [{ model: User, attributes: ['username', 'role'] }]
        }
      ]
    });
    res.json(assignments);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Post a reply (Student or Master)
router.post('/replies', upload.single('audio'), async (req, res) => {
  try {
    const { assignmentId, userId, content, type, parentReplyId } = req.body;
    const reply = await Reply.create({
      assignmentId,
      userId,
      content,
      type: req.file ? 'audio' : (type || 'text'),
      audioUrl: req.file ? `/uploads/content/${req.file.filename}` : null,
      parentReplyId: parentReplyId || null,
      isReadByMaster: false, // Should logic for role be here? Yes.
    });

    const user = await User.findByPk(userId);
    if (user.role === 'master') {
      reply.isReadByMaster = true;
      reply.isReadByUser = false;
      await reply.save();
    }

    res.json(reply);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get all blocks (Admin)
router.get('/blocks', async (req, res) => {
  try {
    const blocks = await StudyBlock.findAll({
      include: [{
        model: Assignment,
        include: [
          { model: User, attributes: ['username'] },
          { model: Reply, include: [User] }
        ]
      }]
    });
    res.json(blocks);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
