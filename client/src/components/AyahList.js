import React, { useState, useEffect } from "react";
import AyahContainer from "./AyahContainer";

const AyahList = ({ start_pos, end_pos }) => {
    const [ayahs, setAyahs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAyahData = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://localhost:501/fetchAyahs", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ start_pos, end_pos })
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
    }, [start_pos, end_pos]); // Only run effect if start_pos or end_pos change

    console.log(`ayahs=${JSON.stringify(ayahs)}`);

    if (loading) return <p>Loading...</p>; // Render loading state

    if (error) return <p>{error}</p>; // Render error state

    return (
        <div className="ayah-list">
            {ayahs.map((ayah) => (
                <AyahContainer
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
