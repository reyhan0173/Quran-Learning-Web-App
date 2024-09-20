const homeworkAssignTable = require('./Tables/homeworkAssignTable');

const getLatestHomework = async (studentId, courseId) => {
  const latestHomework = await homeworkAssignTable.findOne({
    where: { studentId, courseId },
    order: [['assignedOn', 'DESC']] // Orders by assignedOn, descending (most recent first)
  });

  console.log(latestHomework);

  return [
    `${latestHomework['dataValues']['approvedOn']}`,
    `${latestHomework['dataValues']['fromSurah']}:${latestHomework['dataValues']['fromSurah']}`,
    `${latestHomework['dataValues']['toSurah']}:${latestHomework['dataValues']['toAyah']}`
  ];
}

const homeworkAdjust = async (body) => {
  const {studentId, courseId, performance, notes} = body;

  console.log(body);

  try {

    // Find the most recent assignment based on 'assignedOn'
    existingAssignment = await getLatestHomework(studentId, courseId);
    // If an assignment is found, update its fields
    if (existingAssignment) {
      // Create a new assignment based on the existing one
      const newAssignment = existingAssignment.toJSON(); // Convert to plain JavaScript object
      newAssignment.assignedOn = new Date(); // Update the assignedOn time

      // Save the new assignment
      await homeworkAssignTable.create(newAssignment);

      // Update the existing assignment
      await existingAssignment.update({
        approvedOn: new Date(),
        performance: performance,
        approvalNotes: notes
      });

      console.log('Homework Declined.');
      return 1;
    } else {
      console.log('no homework found.');
    }

    console.log('Homework approved.');
    return 1; // Success
  } catch (err) {
    console.error('Error approving homework:', err);
    return 0; // Failure
  }
}


const homeworkDecline = async (body) => {
  const {studentId, courseId, performance, approvalNotes} = body;

  console.log(body);

  try {

    // Find the most recent assignment based on 'assignedOn'
    const existingAssignment = await homeworkAssignTable.findOne({
      where: { studentId, courseId },
      order: [['assignedOn', 'DESC']] // Orders by assignedOn, descending (most recent first)
    });

    // If an assignment is found, update its fields
    if (existingAssignment) {
      // Create a new assignment based on the existing one
      const newAssignment = existingAssignment.toJSON(); // Convert to plain JavaScript object
      newAssignment.assignedOn = new Date(); // Update the assignedOn time

      // Save the new assignment
      await homeworkAssignTable.create(newAssignment);

      // Update the existing assignment
      await existingAssignment.update({
        approvedOn: new Date(),
        performance: performance,
        approvalNotes: approvalNotes
      });

      console.log('Homework Declined.');
      return 1;
    } else {
      console.log('no homework found.');
    }

    console.log('Homework approved.');
    return 1; // Success
  } catch (err) {
    console.error('Error approving homework:', err);
    return 0; // Failure
  }
}


const homeworkApprove = async (body) => {
  const {studentId, courseId, performance, notes} = body;

  console.log(body);

  try {

    // Find the most recent assignment based on 'assignedOn'
    const existingAssignment = await homeworkAssignTable.findOne({
      where: { studentId, courseId },
      order: [['assignedOn', 'DESC']] // Orders by assignedOn, descending (most recent first)
    });

    // If an assignment is found, update its fields
    if (existingAssignment) {
      await existingAssignment.update({
        approvedOn: new Date(),
        performance: performance,
        notes: notes
      });
    } else {
      console.log('no homework found.');
    }

    console.log('Homework approved.');
    return 1; // Success
  } catch (err) {
    console.error('Error approving homework:', err);
    return 0; // Failure
  }
}


const homeworkAssign = async (body) => {
  body = body['assignmentData']
  const {
    studentId,
    courseId,

    fromSurahNumber,
    fromAyahNumber,
    toSurahNumber,
    toAyahNumber,

    listeningGoal,
    listeningFormat,
    qariName,
    qariSpeed,

    recordingCount,
    notes,
  } = body;

  console.log(body);

  try {
    await homeworkAssignTable.create({
      studentId: studentId,
      courseId: courseId,

      assignedOn: new Date(),
      completionTime: null,

      listeningGoal: listeningGoal,
      recordingCount: recordingCount,

      goalMet: 0,
      performance: null,

      fromSurah: fromSurahNumber,
      fromAyah: fromAyahNumber,
      toSurah: toSurahNumber,
      toAyah: toAyahNumber,

      qariName: qariName,
      speed: qariSpeed,
      assignmentNotes: notes,

      approvedOn: null
    });

    console.log('Data successfully inserted.');
    return 1; // Success
  } catch (err) {
    console.error('Error inserting data:', err);
    return 0; // Failure
  }
}

module.exports = { homeworkAssign, getLatestHomework, homeworkApprove, homeworkAdjust, homeworkDecline };
