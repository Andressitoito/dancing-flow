const express = require('express');
const router = express.Router();
const { User, Questionnaire, Assignment, Reply } = require('../models/index.cjs');
const { authMiddleware, profesorMiddleware } = require('../middlewares/auth.cjs');

// All routes in this file require profesor permission
router.use(authMiddleware);
router.use(profesorMiddleware);

// Update user (Pro, role, etc)
router.put('/users/:id', async (req, res) => {
  try {
    const { isPro, role, gender, level, status } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    if (isPro !== undefined) user.isPro = isPro;
    if (role !== undefined) user.role = role;
    if (gender !== undefined) user.gender = gender;
    if (level !== undefined) user.level = level;
    if (status !== undefined) user.status = status;

    await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete user and all related data
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    await user.destroy();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
