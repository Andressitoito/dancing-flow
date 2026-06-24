const express = require('express');
const router = express.Router();
const { User, Questionnaire } = require('../models/index.cjs');
const { authMiddleware, profesorMiddleware } = require('../middlewares/auth.cjs');

// Get current user's questionnaire
router.get('/me/questionnaire', authMiddleware, async (req, res) => {
  try {
    const quest = await Questionnaire.findOne({ where: { userId: req.user.id } });
    res.json(quest);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Update questionnaire
router.post('/me/questionnaire', authMiddleware, async (req, res) => {
  try {
    const data = req.body;

    // Calculate percentage
    const fields = ['whyStarted', 'objectives', 'hardestPart', 'fears', 'recordingPreference', 'personalFeeling'];
    let filled = 0;
    fields.forEach(f => {
      if (data[f] && data[f].trim() !== '') filled++;
    });
    const percentage = Math.round((filled / fields.length) * 100);

    const [quest, created] = await Questionnaire.findOrCreate({
      where: { userId: req.user.id },
      defaults: { ...data, completionPercentage: percentage, isCompleted: percentage === 100 }
    });

    if (!created) {
      await quest.update({ ...data, completionPercentage: percentage, isCompleted: percentage === 100 });
    }

    res.json(quest);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get all users (Admin only)
router.get('/all', authMiddleware, profesorMiddleware, async (req, res) => {
  try {
    const users = await User.findAll({
      include: [Questionnaire],
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Update user level or status (Admin only)
router.patch('/:id', authMiddleware, profesorMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    await user.update(req.body);
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete user (Admin only)
router.delete('/:id', authMiddleware, profesorMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    await user.destroy();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
