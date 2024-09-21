const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const AyahFormattingTable = sequelize.define('AyahFormatting', {
    studentId: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    courseId: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    surahNumber: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    ayahNumber: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    isBookmarked: {
        type: DataTypes.BOOLEAN
    },
    mistakes: {
        type: DataTypes.JSON
    }
}, {
    tableName: 'ayahFormatting', // Table name in the database
    timestamps: false
});

module.exports = AyahFormattingTable;
