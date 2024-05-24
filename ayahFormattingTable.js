const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const AyahFormattingTable = sequelize.define('AyahFormatting', {
    studentId: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    courseId: {
        type: DataTypes.INTEGER
    },
    surahNumber: {
        type: DataTypes.INTEGER
    },
    ayahNumber: {
        type: DataTypes.INTEGER
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
