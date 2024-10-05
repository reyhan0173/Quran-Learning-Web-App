const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); // Import the Sequelize instance

const CourseInfoTable = sequelize.define('CourseInfo', {
    courseId: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    courseName: {
        type: DataTypes.STRING(45)
    },
    teacherName: {
        type: DataTypes.STRING(45)
    },
}, {
    tableName: 'courseInfo', // Table name in the database
    timestamps: false
});

module.exports = CourseInfoTable;
