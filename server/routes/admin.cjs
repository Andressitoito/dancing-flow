const express = require('express');
const router = express.Router();
const { User, Questionnaire, Assignment, Reply } = require('../models/index.cjs');

// Middleware to check if request is from a profesor
const checkProfesor = async (req, res, next) => {
  try {
    const profId = req.headers['x-profesor-id'];
    const prof = await User.findByPk(profId);
    if (!prof || prof.role !== 'profesor') {
      return res.status(403).json({ error: 'No tienes permisos de profesor' });
    }
    req.profesor = prof;
    next();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Update user (Pro, role, etc)
router.put('/users/:id', checkProfesor, async (req, res) => {
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
router.delete('/users/:id', checkProfesor, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // In a real app with files, we'd also delete the files from storage here.
    // Sequelize CASCADE handles the DB records if configured,
    // but let's be explicit if needed or trust the associations.

    await user.destroy();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
