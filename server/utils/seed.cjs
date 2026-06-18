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
      username: 'Andresito',
      password: bcrypt.hashSync(MASTER_PASSWORD, 10),
      role: 'master',
      gender: 'male',
      status: 'active'
    });
    await Questionnaire.create({ userId: master.id });

    // Create 30 Students
    const levels = ['principiante', 'pre-intermedio', 'intermedio', 'avanzado'];
    const genders = ['male', 'female', 'unidentified'];
    const preferences = ['alone', 'couple', 'shy', 'show', 'training_teacher'];

    for (let i = 1; i <= 30; i++) {
      const gender = genders[i % 3];
      const level = levels[i % 4];
      const user = await User.create({
        username: `user${i}`,
        password: bcrypt.hashSync(`password${i}`, 10),
        role: 'student',
        gender: gender,
        level: level,
        status: 'active'
      });

      const completion = Math.floor(Math.random() * 101);
      await Questionnaire.create({
        userId: user.id,
        whyStarted: `Empecé a bailar porque ${i % 2 === 0 ? 'quería socializar' : 'me encanta la bachata'}.`,
        objectives: `Mis objetivos son ${i % 3 === 0 ? 'hacer shows' : 'mejorar mi técnica'}.`,
        hardestPart: `Lo que más me cuesta es ${i % 2 === 0 ? 'el ritmo' : 'la expresión corporal'}.`,
        fears: `Tengo miedo de ${i % 5 === 0 ? 'hacer el ridículo' : 'la cámara'}.`,
        recordingPreference: preferences[i % 5],
        personalFeeling: `Me siento ${i % 2 === 0 ? 'motivado' : 'un poco estancado'}.`,
        testimonial: i % 10 === 0 ? `¡La plataforma me encanta! He mejorado mucho.` : null,
        testimonialStars: 5,
        isCompleted: completion === 100,
        completionPercentage: completion
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
    const students = await User.findAll({ where: { role: 'student' }, limit: 5 });
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
