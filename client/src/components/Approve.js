import React, {useEffect, useState} from "react";
import AudioPlayer from "./AudioPlayer";
import { surahList } from '../functions/surahListFunction';

const homeworkApprove = async (studentId, courseId, performance, notes) => {
  try {
    const response = await fetch("http://localhost:501/homeworkApprove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentId, courseId, performance, notes }),
    });
    if (!response.ok) {
      throw new Error("Failed to add mistake");
    }
  } catch (error) {
    console.error("Error adding mistake:", error);
  }
};

const homeworkAdjust = async (studentId, courseId) => {
  try {
    const response = await fetch("http://localhost:501/homeworkAdjust", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentId, courseId }),
    });
    if (!response.ok) {
      throw new Error("Failed to add mistake");
    }
  } catch (error) {
    console.error("Error adding mistake:", error);
  }
};

const homeworkDecline = async (studentId, courseId, performance, notes) => {
  try {
    const response = await fetch("http://localhost:501/homeworkDecline", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentId, courseId, performance, notes }),
    });
    if (!response.ok) {
      throw new Error("Failed to add mistake");
    }
  } catch (error) {
    console.error("Error adding mistake:", error);
  }
};

const getApprovalStatus = async (studentId, courseId) => {

  try {
    const response = await fetch("http://localhost:501/getApprovalStatus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentId, courseId }),
    });

    if (!response.ok) {
      throw new Error("Failed to add mistake");
    }

    const data = await response.json();
    console.log(data);
    console.log(data.approvalStatus);
    return data.approvalStatus;

  } catch (error) {
    console.error("Error adding mistake:", error);
  }
};

const getLatestHomeworkApprove = async (studentId, courseId) => {
  try {
    console.log("DEBUG:2011");

    const response = await fetch("http://localhost:501/getLatestHomeworkApprove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentId, courseId }),
    });

    // Check if response is okay
    if (!response.ok) {
      throw new Error("Failed to retrieve latest homework");
    }

    // Parse the JSON from the response
    const data = await response.json();

    // Log and return the data
    console.log(data);
    return data;

  } catch (error) {
    console.error("Error retrieving latest homework:", error);
  }
};

export default function Approve({ studentId, courseId, isAssigned, onAssignClick }) {
  let [startSurahName, endSurahName] = ["", ""];

  const [approvalStatus, setApprovalStatus] = useState(0);
  const [latestHomework, setLatestHomework] = useState([]);
  const [isApproveDrawerOpen, setIsApproveDrawerOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedAction, setSelectedAction] = useState(""); // State to track selected button
  const [notes, setNotes] = useState(""); // State for notes/comments
  const [performance, setPerformance] = useState(""); // State for performance

  // Fetch approval status and latest homework when the component mounts or the props change
  useEffect(() => {
    const fetchApprovalStatus = async () => {
      setApprovalStatus(await getApprovalStatus(studentId, courseId));
      console.log("DEBUG 3031");
      console.log(approvalStatus);

      if (approvalStatus === 0) {
        setLatestHomework(await getLatestHomeworkApprove(studentId, courseId));
      }
    };

    fetchApprovalStatus();
  }, [studentId, courseId, isAssigned]);

  // Toggle drawer state
  const toggleApproveDrawer = () => {
    setIsApproveDrawerOpen(!isApproveDrawerOpen);
  };

  // Handle button selection
  const handleActionSelection = async (action) => {
    setSelectedAction(action);
  };

  // Handle notes change
  const handleNotesChange = (event) => {
    setNotes(event.target.value);
  };

  // Handle performance change
  const handlePerformanceChange = (event) => {
    setPerformance(event.target.value);
  };

  // Save function
  const handleSave = async () => {
    const data = {
      studentId,
      courseId,
      performance,
      action: selectedAction,
      notes,
    };

    if (!(studentId && courseId && latestHomework[0] && latestHomework[1] && latestHomework[2] && latestHomework[3] && performance)) {
      console.log("DEBUG 3032");
      console.log(studentId && courseId && latestHomework[0] && latestHomework[1] && latestHomework[2] && latestHomework[3] && performance);
      setIsError(true);
      return;
    }

    if (selectedAction === 'approve') {
      await homeworkApprove(studentId, courseId, performance, notes);
    }

    if (selectedAction === 'reassign') {
      await homeworkAdjust(studentId, courseId);
    }

    if (selectedAction === 'decline') {
      await homeworkDecline(studentId, courseId, performance, notes);
    }

    setIsError(false);
    console.log("Saved Data:", data);
  };

  // Use the latestHomework object to extract homework data if available
  if (latestHomework[0] && latestHomework[1] && latestHomework[2] && latestHomework[3]) {
    startSurahName = surahList[latestHomework[0]][0] || "";
    endSurahName = surahList[latestHomework[2]][0] || "";
  }

  return (
    (isAssigned) && (
      <div className="relative flex justify-end bg-gray-100">
        {/* Drawer Toggle Tab */}
        <input type="checkbox" id="approve-drawer-toggle" className="hidden peer" />
        <label
          htmlFor="approve-drawer-toggle"
          className={`BtnHomeworkFunc fixed top-12 z-30 right-0 p-3 bg-indigo-500 text-white rounded-l-lg cursor-pointer transition-all duration-500 ease-in-out transform ${isApproveDrawerOpen ? 'translate-x-[-20rem]' : ''}`}
          onClick={toggleApproveDrawer}
        >
          {approvalStatus ? "Re-Approve" : "Approve"}
        </label>
        {/* Drawer */}
        <div className={`fixed top-0 right-0 z-40 w-80 h-full bg-white shadow-lg transition-transform duration-500 ease-in-out transform ${isApproveDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="relative px-6 py-4 h-full overflow-y-auto flex flex-col">
            {isError && (
              <div className="bg-red-200 rounded justify-center flex">
                <p className="font-light text-black">One or more fields are empty</p>
              </div>
            )}

            <h2 className="text-2xl flex justify-center font-semibold mt-2 mb-2">Approve Homework</h2>
            <div className="space-y-4 flex flex-col flex-1">
              <div className="text-gray-700">
                <h4 className="font-semibold">Homework Assigned:</h4>
                <p>From: Surah {startSurahName} Ayah {latestHomework[1]}</p>
                <p>To: Surah {endSurahName} Ayah {latestHomework[3]}</p>
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  className={`px-4 py-2 text-white rounded hover:bg-green-700 ${selectedAction === 'approve' ? 'bg-green-700' : 'bg-green-500'}`}
                  onClick={() => handleActionSelection('approve')}
                >
                  Approve &#10004;
                </button>
                <button
                  className={`px-4 py-2 text-white rounded hover:bg-yellow-700 ${selectedAction === 'adjust' ? 'bg-yellow-700' : 'bg-yellow-500'}`}
                  onClick={() => handleActionSelection('adjust')}
                >
                  Adjust &#8909;
                </button>
                <button
                  className={`px-4 py-2 text-white rounded hover:bg-red-700 ${selectedAction === 'decline' ? 'bg-red-700' : 'bg-red-500'}`}
                  onClick={() => handleActionSelection('decline')}
                >
                  Decline &#10006;
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold">Performance:</h4>
                <input
                  type="number"
                  className="w-16 p-1 border rounded"
                  min="0"
                  max="10"
                  step="0.1"
                  value={performance}
                  onChange={handlePerformanceChange}
                />
                <span>/10</span>
              </div>

              <section className={`approveHomework-recordingSection`}>
                <div className={`approveHomework-recordingDetails`}>
                  <button>
                    <i className="fas fa-arrow-left"></i>
                  </button>
                  <p>5/5</p>
                  <button>
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
                <AudioPlayer />
              </section>

              <div className="flex flex-col space-y-2 flex-1">
                <h5 className="font-semibold">Notes/Comments:</h5>
                <textarea
                  className="w-full flex-1 p-2 border rounded resize-none"
                  value={notes}
                  onChange={handleNotesChange}
                ></textarea>
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
                  onClick={() => {
                    handleSave().then(r => onAssignClick());
                  }}
                >
                  Save <i className="fa fa-save"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
