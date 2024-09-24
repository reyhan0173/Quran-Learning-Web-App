const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const userTable = sequelize.define('SchoolUsers', {
  username: {
    type: DataTypes.STRING(45),
    primaryKey: true,
    allowNull: false
  },
  studentId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  secPhoneNumber: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  dob: {
    type: DataTypes.DATE,
    allowNull: false
  },
  accountStatus: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  },
  accountType: {
    type: DataTypes.ENUM('student', 'teacher'),
    defaultValue: 'student'
  },
  accCreationDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  RegisteredClasses: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'SchoolUsers',
  timestamps: false
});

module.exports = userTable;
