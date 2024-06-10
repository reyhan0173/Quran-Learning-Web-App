import React, {useState, useEffect} from "react";

const AyahContainer = ({current_posStr}) => {
    
    const [ayahs, setAyahs] = useState([]);
    const [loopCount, setLoopCount] = useState(4);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [mistakeIndexes, setMistakeIndexes] = useState([]);

    useEffect(() => {
        fetchAyahData(current_posStr);
    }, []);

    const fetchAyahData = async () => {
        const response = await fetch('/api/verse');
        const data = await response.json();
        setAyahs(data);
    }

    return(
        <div className={"ayah-container"}>
            {ayahs.map((ayahs, index) => (
                <div key={index} className={"ayah"} >
                    <div className={"ayah-text"}>{ayahs.text}</div>
                </div>
            ))}
        </div>
    );
}

export default AyahContainer;