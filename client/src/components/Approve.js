import React, { useState } from "react";
import AudioPlayer from "./AudioPlayer";

const getSurahName = (surahNumber) => {
    return "Baqarah"; // Replace with actual logic
}

export default function Approve({ studentId, courseId, startPos, endPos }) {
    const [isApproveDrawerOpen, setIsApproveDrawerOpen] = useState(false);
    const [startSurahNumber, startAyahNumber] = startPos.split(':');
    const [endSurahNumber, endAyahNumber] = endPos.split(':');

    const startSurahName = getSurahName(startSurahNumber);
    const endSurahName = getSurahName(endSurahNumber);

    // Toggle drawer state
    const toggleApproveDrawer = () => {
        setIsApproveDrawerOpen(!isApproveDrawerOpen);
    };

    return (
        <div className="relative flex justify-end bg-gray-100">
            {/* Drawer Toggle Tab */}
            <input type="checkbox" id="approve-drawer-toggle" className="hidden peer" />
            <label
                htmlFor="approve-drawer-toggle"
                className={`BtnHomeworkFunc fixed top-12 z-32 right-0 p-3 bg-indigo-500 text-white rounded-l-lg cursor-pointer transition-all duration-500 ease-in-out transform ${isApproveDrawerOpen ? 'translate-x-[-20rem]' : ''}`}
                onClick={toggleApproveDrawer}
            >
                Approve
            </label>
            {/* Drawer */}
            <div className={`fixed top-0 right-0 z-40 w-80 h-full bg-white shadow-lg transition-transform duration-500 ease-in-out transform ${isApproveDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="relative px-6 py-4 h-full overflow-y-auto flex flex-col">
                    <h2 className="text-2xl flex justify-center font-semibold mt-2 mb-2">Approve Homework</h2>
                    <div className="space-y-4 flex flex-col flex-1">
                        <div className="text-gray-700">
                            <h4 className="font-semibold">Homework Assigned:</h4>
                            <p>From: Surah {startSurahName} Ayah {startAyahNumber}</p>
                            <p>To: Surah {endSurahName} Ayah {endAyahNumber}</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <button className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">
                                Approve &#10004;
                            </button>
                            <button className="px-4 py-2 text-white bg-yellow-500 rounded hover:bg-yellow-600">
                                Adjust &#8909;
                            </button>
                            <button className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">
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
                            />
                            <span>/10</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">Listening:</h4>
                            <i className="fas fa-times-circle text-red-500"></i>
                            <span>Incomplete (3/5)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">Recording:</h4>
                            <i className="fas fa-check-circle text-green-500"></i>
                            <span>Completed (5)</span>
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
                            {/*<AudioPlayer/>*/}
                        </section>

                        <div className="flex flex-col space-y-2 flex-1">
                            <h5 className="font-semibold">Notes/Comments:</h5>
                            <textarea
                                className="w-full flex-1 p-2 border rounded resize-none"
                            ></textarea>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <button className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                                Save <i className="fa fa-save"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}