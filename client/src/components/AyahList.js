import React, { useState, useEffect } from "react";
import AyahContainer from "./AyahContainer";

const AyahList = ({ start_pos, end_pos }) => {
    const [ayahs, setAyahs] = useState([]);

    useEffect(() => {
        fetchAyahData();
    }, [start_pos, end_pos]); // Fetch data when start_pos or end_pos changes

    const fetchAyahData = async () => {
        try {
            const response = await fetch("http://localhost:5000/hello");
            console.log("Response status:", response.status); // Log response status
            const data = await response.json();
            console.log("Fetched data:", data); // Log fetched data
            setAyahs(data);
        } catch (error) {
            console.error("Error fetching ayah data:", error);
        }
    };

    return (
        <div className="ayah-list">
            {ayahs.map((ayah, index) => (
                <AyahContainer
                    key={index}
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
