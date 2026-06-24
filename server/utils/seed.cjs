const express = require('express');
const router = express.Router();
const { User, Questionnaire, StudyBlock, Assignment, Reply } = require('../models/index.cjs');
const bcrypt = require('bcryptjs');

const MASTER_PASSWORD = 'master123'; // Default for seeding

async function seed() {
  try {
    await require('../config/database.cjs').sync({ force: true });
    console.log('Database cleared and synced for seeding.');

    // Create Master
    const master = await User.create({
      username: 'andresito',
      password: bcrypt.hashSync(MASTER_PASSWORD, 10),
      role: 'profesor',
      gender: 'male',
      status: 'active'
    });
    await Questionnaire.create({ userId: master.id });

    // Create 30 Students
    const levels = ['principiante', 'pre-intermedio', 'intermedio', 'avanzado'];
    const genders = ['male', 'female', 'unidentified'];
    const preferences = ['alone', 'couple', 'shy', 'show', 'training_teacher'];
    const whyOptions = ['social', 'hobby', 'sport', 'profession'];
    const objOptions = ['social_dance', 'shows', 'teacher', 'technique'];
    const hardOptions = ['rhythm', 'technique', 'connection', 'expression'];
    const fearOptions = ['ridicule', 'camera', 'mistakes', 'judgment'];

    for (let i = 1; i <= 30; i++) {
      const gender = genders[i % 3];
      const level = levels[i % 4];
      const user = await User.create({
        username: `user${i}`,
        password: bcrypt.hashSync(`password${i}`, 10),
        role: 'alumno',
        gender: gender,
        level: level,
        status: 'active'
      });

      const completion = 100;
      await Questionnaire.create({
        userId: user.id,
        whyStarted: whyOptions[i % 4],
        objectives: objOptions[i % 4],
        hardestPart: hardOptions[i % 4],
        fears: fearOptions[i % 4],
        recordingPreference: preferences[i % 5],
        testimonial: i % 10 === 0 ? `¡La plataforma me encanta! He mejorado mucho.` : null,
        testimonialStars: 5,
        isCompleted: true,
        completionPercentage: 100
      });
    }

    // Create 2 Study Blocks
    const block1 = await StudyBlock.create({
      title: 'Práctica de Básico 1',
      description: 'En este video vemos la técnica correcta del paso básico lateral.',
      type: 'video',
      contentUrl: '/uploads/samples/sample_video_1.mp4',
      level: 'principiante',
      creatorId: master.id
    });

    const block2 = await StudyBlock.create({
      title: 'Musicalidad Intermedia',
      description: 'Análisis de los tiempos fuertes y síncopas.',
      type: 'video',
      contentUrl: '/uploads/samples/sample_video_2.mp4',
      level: 'intermedio',
      creatorId: master.id
    });

    // Assign to some students and add replies
    const students = await User.findAll({ where: { role: 'alumno' }, limit: 5 });
    for (const student of students) {
      const assignment = await Assignment.create({
        studyBlockId: block1.id,
        userId: student.id,
        status: 'replied'
      });

      await Reply.create({
        assignmentId: assignment.id,
        userId: student.id,
        content: 'Profe, no entiendo bien el tercer tiempo, ¿podría explicarlo de nuevo?',
        type: 'text',
        isReadByMaster: false
      });

      await Reply.create({
        assignmentId: assignment.id,
        userId: master.id,
        content: '¡Claro! El tercer tiempo es una pausa activa, fíjate en el video al segundo 0:15.',
        type: 'text',
        isReadByUser: false
      });
    }

    console.log('Seeding completed successfully.');
  } catch (err) {
    console.error('Error during seeding:', err);
  }
}

if (require.main === module) {
  seed();
}

module.exports = seed;
