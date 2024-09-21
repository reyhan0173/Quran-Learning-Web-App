const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const homeworkAssignTable = sequelize.define('homeworkAyah', {
  studentId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  courseId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  assignedOn: {
    type: DataTypes.DATE,
    primaryKey: true
  },
  completionTime: {
    type: DataTypes.DATE
  },
  listeningGoal: {
    type: DataTypes.INTEGER
  },
  recordingCount: {
    type: DataTypes.INTEGER
  },
  goalMet: {
    type: DataTypes.BOOLEAN
  },
  performance: {
    type: DataTypes.FLOAT
  },
  fromSurah: {
    type: DataTypes.STRING(45)
  },
  fromAyah: {
    type: DataTypes.STRING(45)
  },
  toSurah: {
    type: DataTypes.STRING(45)
  },
  toAyah: {
    type: DataTypes.STRING(45)
  },
  qariName: {
    type: DataTypes.STRING(45)
  },
  speed: {
    type: DataTypes.STRING(45)
  },
  assignmentNotes: {
    type: DataTypes.STRING(45) // Notes column allowing NULL
  },
  approvalNotes: {
    type: DataTypes.STRING(45) // Notes column allowing NULL
  },
  approvedOn: {
    type: DataTypes.DATE
  },
}, {
  tableName: 'homeworkAyah',
  timestamps: false
});

module.exports = homeworkAssignTable;
