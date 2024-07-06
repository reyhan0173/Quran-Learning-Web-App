import React, { useState } from "react";
import AudioPlayer from "./AudioPlayer";

const getSurahName = (surahNumber) => {
    return "Baqarah"; // Replace with actual logic
}

export default function Assign({ studentId, courseId, startPos, endPos }) {
    const [isAssignDrawerOpen, setIsAssignDrawerOpen] = useState(false);
    const [startSurahNumber, startAyahNumber] = startPos.split(':');
    const [endSurahNumber, endAyahNumber] = endPos.split(':');

    const startSurahName = getSurahName(startSurahNumber);
    const endSurahName = getSurahName(endSurahNumber);

    // Toggle drawer state
    const toggleAssignDrawer = () => {
        setIsAssignDrawerOpen(!isAssignDrawerOpen);
    };

    return (
        <div className="relative flex justify-end bg-gray-100">
            {/* Drawer Toggle Tab */}
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
                className={`fixed top-0 right-0 z-40 w-80 h-full bg-white shadow-lg transition-transform duration-500 ease-in-out transform ${isAssignDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="relative px-6 py-2 h-full overflow-y-auto flex flex-col">
                    <h2 className="text-2xl flex justify-center font-semibold mt-2 mb-2">Assign Homework</h2>
                    <div className="flex flex-col flex-1">
                        <div className="text-gray-700 mt-2 mb-2">
                            <div className="flex items-center space-x-2 mb-2 mt-2">
                                <h4 className="font-light">From:</h4>
                                <select className="w-full p-1 border rounded">
                                    <option value="1">Each ayah</option>
                                    <option value="2">Entire Assignment</option>
                                </select>

                                <h4 className="font-semibold">Ayah:</h4>
                                <input
                                    type="number"
                                    className="w-16 p-1 border rounded"
                                    min="0"
                                    max="2"
                                    step="0.01"
                                />
                            </div>
                            <div className="flex items-center space-x-2 mb-2 mt-2">
                                <h4 className="font-light">To:</h4>
                                <select className="w-full p-1 border rounded">
                                    <option value="1">Each ayah</option>
                                    <option value="2">Entire Assignment</option>
                                </select>

                                <h4 className="font-semibold">Ayah:</h4>
                                <input
                                    type="number"
                                    className="w-16 p-1 border rounded"
                                    min="0"
                                    max="2"
                                    step="0.01"
                                />
                            </div>
                        </div>
                        <div className="flex mt-2 mb-2 items-center space-x-2">
                            <h4 className="font-semibold">Listening:</h4>
                            <input
                                type="number"
                                className="w-16 p-1 border rounded"
                                min="0"
                                max="100"
                                step="1"
                            />
                            <select className="w-full p-1 border rounded">
                                <option value="1">Each ayah</option>
                                <option value="2">Entire Assignment</option>
                            </select>
                        </div>
                        <div className="flex items-center space-x-2 mb-2 mt-2">
                            <h4 className="font-semibold">Qari:</h4>
                            <select className="w-full p-1 border rounded">
                                <option value="1">Each ayah</option>
                                <option value="2">Entire Assignment</option>
                            </select>

                            <h4 className="font-semibold">Speed:</h4>
                            <input
                                type="number"
                                className="w-16 p-1 border rounded"
                                min="0"
                                max="2"
                                step="0.01"
                            />
                        </div>
                        <div className="flex items-center space-x-2 mb-2 mt-2">
                            <h4 className="font-semibold">Recording:</h4>
                            <input
                                type="number"
                                className="w-16 p-1 border rounded"
                                min="0"
                                max="20"
                                step="1"
                            />
                        </div>
                        <div className="flex flex-col mt-2 mb-2 flex-1">
                            <h5 className="font-semibold">Notes/Comments:</h5>
                            <textarea
                                className="w-full flex-1 p-2 border rounded resize-none"
                            ></textarea>
                        </div>
                    </div>
                    <div className="flex flex-col mt-2 mb-2">
                        <button className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">
                            Assign &#10004;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}