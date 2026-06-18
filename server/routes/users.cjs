const express = require('express');
const router = express.Router();
const { User, Questionnaire } = require('../models/index.cjs');

// Get current user's questionnaire
router.get('/me/questionnaire', async (req, res) => {
  try {
    const { userId } = req.query; // For now, passing via query until middleware is more robust
    const quest = await Questionnaire.findOne({ where: { userId } });
    res.json(quest);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Update questionnaire
router.post('/me/questionnaire', async (req, res) => {
  try {
    const { userId, ...data } = req.body;

    // Calculate percentage
    const fields = ['whyStarted', 'objectives', 'hardestPart', 'fears', 'recordingPreference', 'personalFeeling'];
    let filled = 0;
    fields.forEach(f => {
      if (data[f] && data[f].trim() !== '') filled++;
    });
    const percentage = Math.round((filled / fields.length) * 100);

    const [quest, created] = await Questionnaire.findOrCreate({
      where: { userId },
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

// Get all users (Admin)
router.get('/all', async (req, res) => {
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

// Update user level or status (Admin)
router.patch('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.update(req.body);
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete user (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.destroy();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
