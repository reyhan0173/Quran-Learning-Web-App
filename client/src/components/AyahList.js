import React, { useState, useEffect } from "react";
import AyahContainer from "./AyahContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const AyahList = ({ courseId }) => {
    const [ayahs, setAyahs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [studentId, setStudentId] = useState(null); // Initialize studentId as null

    // Fetch active user when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post('http://localhost:501/getActiveUser', {}, { withCredentials: true });
                const activeUser = Number(response.data.activeUser); // Log response data
                setStudentId(activeUser); // Set studentId
            } catch (error) {
                console.error("Error fetching active user:", error);
            }
        };

        fetchData(); // Call the fetch function
    }, []); // Runs only once when the component mounts

    // Log studentId whenever it changes
    useEffect(() => {
        console.log('studentId', studentId); // This will log the updated value
    }, [studentId]); // Only runs when studentId changes

    // Fetch ayah data when studentId is set
    useEffect(() => {
        if (studentId !== null) { // Check if studentId is not null
            const fetchAyahData = async () => {
                setLoading(true);
                try {
                    const response = await fetch("http://localhost:501/fetchAyahs", {
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
                    setError(null);
                } catch (error) {
                    console.error("Error fetching ayah data:", error);
                    setError("Failed to fetch ayah data");
                } finally {
                    setLoading(false); // Set loading to false after fetch is complete
                }
            };

            fetchAyahData(); // Call the fetch function
        }
    }, [studentId, courseId]); // Depend on studentId and courseId

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
