import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import * as PropTypes from "prop-types";
import {surahList} from "../functions/surahListFunction";

const calculateTotalAyahs = (fromSurah, fromAyah, toSurah, toAyah) => {
  // Assuming surahList is an array/dictionary where each surah has a key that returns its total number of ayahs.
  // Example: surahList[surahNumber] = total number of ayahs in that surah
  console.log(fromSurah, fromAyah, toSurah, toAyah);
  let totalAyahs = 0;

  // If fromSurah and toSurah are the same, just subtract the ayahs
  if (fromSurah === toSurah) {
    totalAyahs = toAyah - fromAyah + 1; // +1 because we include the starting ayah
  } else {
    // If fromSurah and toSurah are different
    // Add the remaining ayahs from fromSurah
    totalAyahs += surahList[fromSurah][1] - fromAyah + 1;
    console.log(totalAyahs);

    // Add the ayahs in between the surahs
    for (let i = parseInt(fromSurah) + 1; i < parseInt(toSurah); i++) {
      totalAyahs += surahList[i][1];
    }

    // Add the ayahs up to the toAyah in the toSurah
    totalAyahs += parseInt(toAyah);
    console.log(totalAyahs);
  }

  return totalAyahs;
};

function HomeworkCardElement({ courseId, courseName, courseHomework }) {

  return (
    <div className="m-5 group scale-75 h-96 flex justify-center relative" id={courseId}>
      {/* Expanding Drawer */}
      <div
        className="absolute rounded-3xl p-5 bg-white shadow-xl drop-shadow-2xl h-96 w-72 z-10 transition-transform transform translate-x-24 group-hover:translate-x-32 opacity-90 group-hover:opacity-100"
      >
        <div className="pl-5 pr-3">
          <div className="">
            <h1 className="uppercase text-2xl font-bold text-teal-800">{courseName}</h1>
          </div>

          <ul className="list-none my-4 p-3 text-sm space-y-2">
            <li><strong>Date:</strong> {courseHomework[0] ? courseHomework[0]['assignedOn'] : 'N/A'}</li>
            <li>
              <strong>From: </strong>{courseHomework[0] ? `${surahList[courseHomework[0]['fromSurah']][0]} ${courseHomework[0]['fromAyah']}` : 'N/A'}
            </li>
            <li>
              <strong>From: </strong>{courseHomework[0] ? `${surahList[courseHomework[0]['toSurah']][0]} ${courseHomework[0]['toAyah']}` : 'N/A'}
            </li>
            <li>
              <strong>Total Ayahs: </strong>
              {courseHomework[0] ?
                calculateTotalAyahs(
                  courseHomework[0]['fromSurah'],
                  courseHomework[0]['fromAyah'],
                  courseHomework[0]['toSurah'],
                  courseHomework[0]['toAyah']
                ) : 'N/A'}
            </li>
            <li>
              <strong>Repetitions: </strong>
              {courseHomework[0] ? courseHomework[0]['listeningGoal'] : 'N/A'}</li>
            <li>
              <strong>Notes: </strong>
              {courseHomework[0] ? courseHomework[0]['approvalNotes'] ? courseHomework[0]['assignmentNotes'] : '' : 'N/A'}
            </li>
            <li>
              <strong>Approval status: </strong>
              {courseHomework[0] ? courseHomework[0]['approvedOn'] ? 'approved' : 'Not approved' : 'N/A'}
            </li>
            <li>
              <strong>Recent performance: </strong>
              {courseHomework[0] && courseHomework[0]['performance'] ?
                courseHomework[0]['performance'] :
                courseHomework[1] && courseHomework[1]['performance'] ? courseHomework[1]['performance'] : 'N/A'}
            </li>
          </ul>

          {/* Button at the Bottom Right */}
          <div className="absolute bottom-4 right-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors"
              onClick={() => {}}
            >
              Open Quran ->
            </button>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div
        className="rounded-3xl shadow-xl drop-shadow py-10 h-96 w-72 z-20 bg-teal-600 group-hover:z-0 transition-transform">
        <div className="h-3/5 w-full bg-cover bg-center"
             style={{backgroundImage: `url(https://png.pngtree.com/png-clipart/20210321/original/pngtree-vector-quran-icon-png-image_6143183.jpg)`}}></div>
        <div className="text-center mt-4 px-4">
          <h1 className="uppercase text-2xl font-bold text-white font-serif tracking-wider">
            {courseName}
          </h1>
        </div>
      </div>
    </div>
  );
}

const HomeworkCard = () => {
  const navigate = useNavigate();
  const [courseIds, setCourseIds] = useState([]);
  const [courseNames, setCourseNames] = useState([]);
  const [courseHomeworks, setCourseHomeworks] = useState([]);

  const studentId = 1111115;

  useEffect(() => {
    console.log("Course IDs: ", courseIds);
    console.log("Course Names: ", courseNames);
    console.log("Course Homeworks: ", courseHomeworks);
  }, [courseIds, courseNames, courseHomeworks]);

  useEffect(() => {
    const fetchEnrolledCoursesInfo = async () => {
      try {
        const response = await fetch('http://localhost:501/enrolledCoursesInfo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({studentId}),
        });
        const data = await response.json();
        setCourseIds(data['enrolledCourses']);
        setCourseNames(data['courseNames']);
        setCourseHomeworks(data['courseHomeworks']);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
      }
    };

    fetchEnrolledCoursesInfo();
  }, []);

  const handleButtonClick = () => {
    navigate('/quran-explorer');
  };

  return (
      <div className="grid grid-cols-3 gap-4">
        {courseIds.map((courseId, index) => (
          courseNames[index] &&
            <HomeworkCardElement courseId={courseId} courseName={courseNames[index]} courseHomework={courseHomeworks[index]} />
        ))}
      </div>
  );
}
export default HomeworkCard;
