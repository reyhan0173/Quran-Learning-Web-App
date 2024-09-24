const userTable = require('./Tables/userTable');

const getStudentId = async (username) => {
  try {
    // Find the user by username
    const user = await userTable.findOne({
      select: ['studentId'],
      where: {
        username: username,
      },
    });

    if (user) {
      console.log('User found:', user);
      return user.studentId; // Return the student ID if found
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error fetching student ID:', error.message);
    throw error; // Rethrow the error if you want to handle it further up the call stack
  }
};

module.exports = { getStudentId };
