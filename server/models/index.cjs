const User = require('./User.cjs');
const Questionnaire = require('./Questionnaire.cjs');
const StudyBlock = require('./StudyBlock.cjs');
const Assignment = require('./Assignment.cjs');
const Reply = require('./Reply.cjs');

// User <-> Questionnaire (One-to-One)
User.hasOne(Questionnaire, { foreignKey: 'userId', onDelete: 'CASCADE' });
Questionnaire.belongsTo(User, { foreignKey: 'userId' });

// StudyBlock <-> Assignment (One-to-Many)
StudyBlock.hasMany(Assignment, { foreignKey: 'studyBlockId', onDelete: 'CASCADE' });
Assignment.belongsTo(StudyBlock, { foreignKey: 'studyBlockId' });

// User <-> Assignment (One-to-Many)
User.hasMany(Assignment, { foreignKey: 'userId', onDelete: 'CASCADE' });
Assignment.belongsTo(User, { foreignKey: 'userId' });

// Assignment <-> Reply (One-to-Many)
Assignment.hasMany(Reply, { foreignKey: 'assignmentId', onDelete: 'CASCADE' });
Reply.belongsTo(Assignment, { foreignKey: 'assignmentId' });

// User <-> Reply (One-to-Many)
User.hasMany(Reply, { foreignKey: 'userId' });
Reply.belongsTo(User, { foreignKey: 'userId' });

// Self-referential for Reply (threading)
Reply.hasMany(Reply, { as: 'SubReplies', foreignKey: 'parentReplyId' });
Reply.belongsTo(Reply, { as: 'ParentReply', foreignKey: 'parentReplyId' });

module.exports = {
  User,
  Questionnaire,
  StudyBlock,
  Assignment,
  Reply
};
