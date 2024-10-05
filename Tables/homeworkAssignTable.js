const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const homeworkAssignTable = sequelize.define('homeworkAyah', {
  studentId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  courseId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  assignedOn: {
    type: DataTypes.DATE,
    primaryKey: true,
    allowNull: false,
  },
  completionTime: {
    type: DataTypes.DATE,
    defaultValue: null
  },
  listeningGoal: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  recordingGoal: {
    type: DataTypes.INTEGER,
    defaultValue: null
  },
  recordingCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  performance: {
    type: DataTypes.FLOAT,
    defaultValue: null,
  },
  fromSurah: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  fromAyah: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  toSurah: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  toAyah: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  qariName: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  speed: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  assignmentNotes: {
    type: DataTypes.STRING(45),
    defaultValue: null,
  },
  approvalNotes: {
    type: DataTypes.STRING(45),
    defaultValue: null,
  },
  approvedOn: {
    type: DataTypes.DATE,
    defaultValue: null,
  },
}, {
  tableName: 'homeworkAyah',
  timestamps: false
});

module.exports = homeworkAssignTable;
