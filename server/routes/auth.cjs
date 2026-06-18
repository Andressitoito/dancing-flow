const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User, Questionnaire } = require('../models/index.cjs');

const TOKEN = "bachata2026";

router.post('/signup-user', async (req, res) => {
  try {
    const { username, password, token, gender, level } = req.body;
    if (token !== TOKEN) {
      return res.status(401).json({ error: 'Token de registro inválido' });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
    }

    const existingUser = await User.findOne({ where: { username: username.toLowerCase() } });
    if (existingUser) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await User.create({
      username: username.toLowerCase(),
      password: hashedPassword,
      gender: gender || 'unidentified',
      level: level || 'principiante',
      role: 'student',
      status: 'active'
    });

    // Initialize empty questionnaire
    await Questionnaire.create({ userId: newUser.id });

    const userResponse = newUser.toJSON();
    delete userResponse.password;
    res.json(userResponse);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/login-user', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      where: { username: username.toLowerCase() },
      include: [Questionnaire]
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: `Tu cuenta está ${user.status === 'banned' ? 'baneada' : 'pausada'}.` });
    }

    user.lastLogin = new Date();
    await user.save();

    const userResponse = user.toJSON();
    delete userResponse.password;
    res.json(userResponse);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
