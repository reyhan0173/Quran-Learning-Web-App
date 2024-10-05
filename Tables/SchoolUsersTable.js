const { DataTypes, INTEGER} = require('sequelize');
const sequelize = require('../sequelize'); // Import the Sequelize instance

const SchoolUsersTable = sequelize.define('SchoolUsers', {
    username: {
        type: DataTypes.STRING(45),
        primaryKey: true,
        allowNull: false,
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    firstName: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING(15),
        defaultValue: null,
    },
    secPhoneNumber: {
        type: DataTypes.STRING(15),
        defaultValue: null,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    dob: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    accountStatus: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
    },
    accountType: {
        type: DataTypes.ENUM('student', 'teacher', 'principal', 'admin'),
        allowNull: false,
        defaultValue: 'student',
    },
    accCreationDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    lastLogin: {
        type: DataTypes.DATE,
        defaultValue: null,
    },
    RegisteredClasses: {
        type: DataTypes.JSON,
        defaultValue: null,
    },
}, {
    tableName: 'SchoolUsers', // Table name in the database
    timestamps: false
});

module.exports = SchoolUsersTable;
