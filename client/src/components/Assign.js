import React, { useState } from "react";
import { surahList } from '../functions/surahListFunction';

const assign = async (assignmentData) => {
  console.log(assignmentData);
  try {
    const response = await fetch("http://localhost:501/homeworkAssign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ assignmentData }),
    });
    if (!response.ok) {
      throw new Error("Failed to add mistake");
    }
  } catch (error) {
    console.error("Error adding mistake:", error);
  }
};

export default function ({ studentId, courseId }) {
  const [isAssignDrawerOpen, setIsAssignDrawerOpen] = useState(false);
  const [isError, setIsError] = useState(false);

  const [fromSurahNumber, setFromSurahNumber] = useState(0);
  const [fromAyahNumber, setFromAyahNumber] = useState(0);
  const [toSurahNumber, setToSurahNumber] = useState(0);
  const [toAyahNumber, setToAyahNumber] = useState(0);

  const [listeningGoal, setListeningGoal] = useState(0);
  const [listeningFormat, setListeningFormat] = useState("each ayah");
  const [qariName, setQariName] = useState("Shaykh A");
  const [qariSpeed, setQariSpeed] = useState(1);
  const [recordingCount, setRecordingCount] = useState(0);
  const [notes, setNotes] = useState("");

  // Toggle drawer state
  const toggleAssignDrawer = () => {
      setIsAssignDrawerOpen(!isAssignDrawerOpen);
  };

  const handleAssign = async () => {
    const assignmentData = {
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
    };

    if (!(studentId && courseId &&
      fromSurahNumber && fromAyahNumber && toSurahNumber && toAyahNumber &&
      listeningGoal && listeningFormat && qariName && qariSpeed
    )) {
      setIsError(true);
      return 0;
    }

    setIsError(false);
    await assign(assignmentData);
    return 1;
  };

  return (
    <div className="relative flex justify-end bg-gray-100">
      <input type="checkbox" id="assign-drawer-toggle" className="hidden peer" />
      <label
        htmlFor="assign-drawer-toggle"
        className={`BtnHomeworkFunc fixed top-28 z-30 right-0 p-3 bg-indigo-500 text-white rounded-l-lg cursor-pointer transition-all duration-500 ease-in-out transform ${isAssignDrawerOpen ? 'translate-x-[-20rem]' : ''}`}
        onClick={toggleAssignDrawer}
      >
        Assign
      </label>

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-40 w-80 h-full bg-white shadow-lg transition-transform duration-500 ease-in-out transform ${isAssignDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="relative px-6 py-2 h-full overflow-y-auto flex flex-col">
          {isError && <div className="bg-red-200 rounded justify-center flex">
            <p className="font-light text-black">One or more fields are empty</p>
          </div>}

          <h2 className="text-2xl flex justify-center font-semibold mt-2 mb-2">Assign Homework</h2>
          <div className="flex flex-col flex-1">
            <div className="text-gray-700 mt-2 mb-2">
              <div className="flex items-center space-x-2 mb-2 mt-2">
                <h4 className="font-light">From:</h4>
                <select
                  className="w-full p-1 border rounded"
                  value={fromSurahNumber}
                  onChange={(e) => setFromSurahNumber(Number(e.target.value))}
                >
                  <option key="0" value="0">Select a Surah</option>
                  {Object.keys(surahList)
                    .filter(key => toSurahNumber === 0 ||
                      key <= toSurahNumber)
                    .map((key) => (
                      <option key={key} value={key}>
                        {key}. {surahList[key][0]}
                      </option>
                    ))}
                </select>

                <h4 className="font-semibold">Ayah:</h4>
                <select
                  className="w-full p-1 border rounded"
                  value={fromAyahNumber}
                  onChange={(e) => setFromAyahNumber(Number(e.target.value))}
                >
                  <option key="0" value="0">--</option>
                  {fromSurahNumber > 0 &&
                    Array.from({length: surahList[fromSurahNumber][1]}, (_, i) => {
                      const ayahNumber = i + 1;

                      if (!toAyahNumber || (ayahNumber <= toAyahNumber || fromSurahNumber !== toSurahNumber)) {
                        return (
                          <option key={ayahNumber} value={ayahNumber}>
                            {ayahNumber}
                          </option>
                        );
                      }

                      return null; // Return null if the condition is not met, to avoid rendering anything
                    })
                  }
                </select>
              </div>

              <div className="flex items-center space-x-2 mb-2 mt-2">
                <h4 className="font-light">To:</h4>
                <select
                  className="w-full p-1 border rounded"
                  value={toSurahNumber}
                  onChange={(e) => setToSurahNumber(Number(e.target.value))}
                >
                  <option key="0" value="0">Select a Surah</option>
                  {Object.keys(surahList)
                    .filter(key => fromSurahNumber === 0 ||
                      key >= fromSurahNumber)
                    .map((key) => (
                      <option key={key} value={key}>
                        {key}. {surahList[key][0]}
                      </option>
                    ))}
                </select>

                <h4 className="font-semibold">Ayah:</h4>
                <select
                  className="w-full p-1 border rounded"
                  value={toAyahNumber}
                  onChange={(e) => setToAyahNumber(Number(e.target.value))}
                >
                  <option key="0" value="0">--</option>
                  {toSurahNumber > 0 &&
                    Array.from({length: surahList[toSurahNumber][1]}, (_, i) => {
                      const ayahNumber = i + 1;

                      if (!fromAyahNumber || ayahNumber >= fromAyahNumber || toSurahNumber !== fromSurahNumber) {
                        return (
                          <option key={ayahNumber} value={ayahNumber}>
                            {ayahNumber}
                          </option>
                        );
                      }

                      return null; // Return null if the condition is not met, to avoid rendering anything
                    })
                  }
                </select>
              </div>
            </div>

            <div className="flex mt-2 mb-2 items-center space-x-2">
              <h4 className="font-semibold">Listening:</h4>
              <input
                type="number"
                className="w-16 p-1 border rounded"
                value={listeningGoal}
                onChange={(e) => setListeningGoal(Number(e.target.value))}
                min="0"
              />
              <select
                className="w-full p-1 border rounded"
                value={listeningFormat}
                onChange={(e) => setListeningFormat(e.target.value)}
              >
                <option value="each ayah">Each ayah</option>
                <option value="entire assignment">Entire Assignment</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 mb-2 mt-2">
              <h4 className="font-semibold">Qari:</h4>
              <select
                className="w-full p-1 border rounded"
                value={qariName}
                onChange={(e) => setQariName(e.target.value)}
              >
                <option value="Shaykh A">Shaykh A</option>
                <option value="Shaykh B">Shaykh B</option>
                {/* Add more options here */}
              </select>
              <h4 className="font-semibold">Speed:</h4>
              <select
                className="w-full p-1 border rounded"
                value={qariSpeed}
                onChange={(e) => setQariSpeed(Number(e.target.value))}
              >
                <option value="0.25">0.25x (slowest)</option>
                <option value="0.5">0.5x</option>
                <option value="0.75x">0.75x</option>
                <option value="1">1x (Default)</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="1.75">1.75x</option>
                <option value="2">2x (fastest)</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 mb-2 mt-2">
              <h4 className="font-semibold">Recording:</h4>
              <input
                type="number"
                className="w-16 p-1 border rounded"
                value={recordingCount}
                onChange={(e) => setRecordingCount(Number(e.target.value))}
                min="0"
                max="20"
              />
            </div>

            <div className="flex flex-col mt-2 mb-2 flex-1">
              <h5 className="font-semibold">Notes/Comments:</h5>
              <textarea
                className="w-full flex-1 p-2 border rounded resize-none"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="flex flex-col mt-2 mb-2">
            <button
              className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-700"
              onClick={handleAssign}
            >
              Assign &#10004;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
