const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize'); // Import the Sequelize instance

const AyahInfo = sequelize.define('AyahInfo', {
    surahNumber: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    ayahNumber: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    indopakURL: {
        type: DataTypes.STRING(255)
    },
    recitationURL: {
        type: DataTypes.STRING(255)
    },
    ayahText: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'ayahInfo', // Table name in the database
    timestamps: false
});

module.exports = AyahInfo;
