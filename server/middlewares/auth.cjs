const { User } = require('../models/index.cjs');

const authMiddleware = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'No se proporcionó el ID de usuario' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Tu cuenta no está activa' });
    }

    req.user = user;
    next();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const profesorMiddleware = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (req.user.role !== 'profesor') {
      return res.status(403).json({ error: 'No tienes permisos de profesor' });
    }

    next();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = { authMiddleware, profesorMiddleware };
