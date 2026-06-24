const express = require('express');
const router = express.Router();
const { StudyBlock, Assignment, Reply, User } = require('../models/index.cjs');
const multer = require('multer');
const fs = require('fs');
const { authMiddleware, profesorMiddleware } = require('../middlewares/auth.cjs');

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

// All study routes require authentication
router.use(authMiddleware);

// Create Study Block (Admin)
router.post('/blocks', profesorMiddleware, upload.single('file'), async (req, res) => {
  try {
    const { title, description, type, level } = req.body;
    const block = await StudyBlock.create({
      title,
      description,
      type,
      level,
      creatorId: req.user.id,
      contentUrl: req.file ? `/uploads/content/${req.file.filename}` : null
    });
    res.json(block);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Assign to students (Admin)
router.post('/assignments', profesorMiddleware, async (req, res) => {
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

// Get blocks for the logged-in student
router.get('/my-assignments', async (req, res) => {
  try {
    const assignments = await Assignment.findAll({
      where: { userId: req.user.id },
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
router.post('/replies', upload.fields([{ name: 'audio', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  try {
    const { assignmentId, content, type, parentReplyId } = req.body;

    // Verify assignment belongs to user or user is professor
    const assignment = await Assignment.findByPk(assignmentId);
    if (!assignment) return res.status(404).json({ error: 'Asignación no encontrada' });

    if (assignment.userId !== req.user.id && req.user.role !== 'profesor') {
      return res.status(403).json({ error: 'No tienes permiso para replicar en esta asignación' });
    }

    let finalType = type || 'text';
    if (req.files && req.files['audio']) finalType = 'audio';
    if (req.files && req.files['video']) finalType = 'video';

    const reply = await Reply.create({
      assignmentId,
      userId: req.user.id,
      content,
      type: finalType,
      audioUrl: (req.files && req.files['audio']) ? `/uploads/content/${req.files['audio'][0].filename}` : null,
      videoUrl: (req.files && req.files['video']) ? `/uploads/content/${req.files['video'][0].filename}` : null,
      parentReplyId: parentReplyId || null,
      isReadByMaster: req.user.role === 'profesor',
      isReadByUser: req.user.role !== 'profesor'
    });

    res.json(reply);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get all blocks (Admin only)
router.get('/blocks', profesorMiddleware, async (req, res) => {
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
