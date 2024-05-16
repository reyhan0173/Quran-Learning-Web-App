const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('Quran_Explorer', 'admin', 'AWSPassword',{
    host: 'quran-explorer-database.czw6sce2sgea.us-east-2.rds.amazonaws.com',
    dialect: 'mysql'
});

module.exports = sequelize;
