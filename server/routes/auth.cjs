const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User, Questionnaire } = require('../models/index.cjs');

const TOKEN = "bachata2026";

router.put('/change-role', async (req, res) => {
  try {
    const { userId, newRole, token } = req.body;
    const secretToken = process.env.AUTH_TOKEN;

    if (!secretToken || token !== secretToken) {
      return res.status(401).json({ error: 'Token de administrador inválido o no configurado' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    user.role = newRole;
    await user.save();

    res.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

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

    // Map frontend Spanish gender values to backend ENUM
    const genderMap = {
      'hombre': 'male',
      'mujer': 'female',
      'otro': 'otro'
    };
    const dbGender = genderMap[gender] || 'otro';

    const newUser = await User.create({
      username: username.toLowerCase(),
      password: hashedPassword,
      gender: dbGender,
      level: level || 'principiante',
      role: 'alumno',
      status: 'active'
    });

    const questionnaire = await Questionnaire.create({
      userId: newUser.id,
      recordingPreference: 'alone'
    });

    const userResponse = newUser.toJSON();
    delete userResponse.password;
    userResponse.Questionnaire = questionnaire.toJSON();
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
