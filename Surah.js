const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Surah = sequelize.define('Surah', {
    SurahNumber: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    SurahName: {
        type: DataTypes.STRING
    },
    NumberOfVerses: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'Surahs', // Table name in the database
    timestamps: false
});

module.exports = Surah;
