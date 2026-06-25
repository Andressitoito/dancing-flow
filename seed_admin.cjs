const sequelize = require('./server/config/database.cjs');
const User = require('./server/models/User.cjs');
const Questionnaire = require('./server/models/Questionnaire.cjs');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const username = 'andresito';
    const password = 'master123';
    const hashedPassword = bcrypt.hashSync(password, 10);

    const [user, created] = await User.findOrCreate({
      where: { username },
      defaults: {
        password: hashedPassword,
        role: 'profesor',
        gender: 'male',
        level: 'avanzado',
        status: 'active'
      }
    });

    if (created) {
      console.log('Admin user created');
      await Questionnaire.create({
        userId: user.id,
        recordingPreference: 'alone'
      });
    } else {
      console.log('Admin user exists, updating role');
      user.role = 'profesor';
      await user.save();
    }

    console.log('Seed complete');
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await sequelize.close();
  }
}

seedAdmin();
