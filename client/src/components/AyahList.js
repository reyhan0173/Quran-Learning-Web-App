import React, { useState, useEffect } from "react";
import AyahContainer from "./AyahContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const AyahList = ({ studentId, courseId }) => {
    const [ayahs, setAyahs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [startPos, setStartPos] = useState(0);
    const [endPos, setEndPos] = useState(0);


    useEffect(() => {
        const fetchAyahData = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://3.129.90.105:5000/fetchAyahs", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ studentId, courseId })
                });
                console.log("Response status:", response.status); // Log response status

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Fetched data:", data); // Log fetched data

                setAyahs(data);
                setLoading(false);
                setError(null);
            } catch (error) {
                console.error("Error fetching ayah data:", error);
                setLoading(false);
                setError("Failed to fetch ayah data");
            }
        };

        fetchAyahData(); // Initial fetch when component mounts

        // Cleanup function (optional)
        return () => {
            // Cleanup code if needed
        };
    }, [startPos, endPos]); // Only run effect if startPos or endPos change

    console.log(`ayahs=${JSON.stringify(ayahs)}`);

    if (loading) return (
      <div className="flex justify-center items-center h-full">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" />
      </div>
    ); // Render loading spinner

    if (error) return <p>{error}</p>; // Render error state

    return (
        <div className="ayah-list">
            {ayahs.map((ayah) => (
                <AyahContainer
                    studentId={studentId}
                    courseId={courseId}
                    key={ayah.current_posStr} // Assuming current_posStr is unique and stable
                    ayahData={ayah}
                    updateAyah={(updatedAyah) => {
                        setAyahs((prevAyahs) =>
                            prevAyahs.map((a) =>
                                a.current_posStr === updatedAyah.current_posStr ? updatedAyah : a
                            )
                        );
                    }}
                />
            ))}
        </div>
    );
};

export default AyahList;
