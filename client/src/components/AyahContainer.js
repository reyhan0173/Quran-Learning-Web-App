import React, { useState, useEffect } from 'react';
import { useAudioPlayer } from './AudioPlayerContext'; // Import the context
const RECITER = 3;

const AyahContainer = ({ ayahData }) => {
    const { current_posStr, verse, mistakes: initialMistakes, isBookmarked: initialIsBookmarked, loop: initialLoop } = ayahData;
    const [mistakes, setMistakes] = useState(initialMistakes);
    const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
    const [loop, setLoop] = useState(initialLoop);

    const { currentAyah, isPlaying, updateAyah } = useAudioPlayer(); // Destructure currentAyah, isPlaying, and updateAyah from the context

    const fetchAudioUrl = async (ayahId, reciter) => {
        const api = `https://api.quran.com/api/v4/recitations/${reciter}/by_ayah/${ayahId}`;
        const response = await fetch(api);
        if (!response.ok) {
            throw new Error("Failed to fetch data: " + response.statusText);
        }
        const data = await response.json();
        const directory = data.audio_files[0].url;
        const audioUrl = `https://verses.quran.com/${directory}`;
        return audioUrl;
    };

    const playAudio = async () => {
        const audioUrl = await fetchAudioUrl(current_posStr, RECITER); // Fetch the audio URL
        updateAyah(current_posStr, audioUrl); // Update the context with the current ayah and URL
    };

    const toggleBookmark = async () => {
        try {
            const endpoint = isBookmarked ? "/removeBookmark" : "/addBookmark";
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ current_posStr }),
            });
            if (!response.ok) {
                throw new Error(`Failed to ${isBookmarked ? "remove" : "add"} bookmark`);
            }
            setIsBookmarked(!isBookmarked);
        } catch (error) {
            console.error(`Error ${isBookmarked ? "removing" : "adding"} bookmark:`, error);
        }
    };

    const addMistake = async () => {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) {
            alert("Please select text to mark as a mistake.");
            return;
        }

        const selectedText = selection.toString();
        if (!selectedText) {
            alert("Please select text to mark as a mistake.");
            return;
        }

        const ayahText = verse;
        const range = selection.getRangeAt(0);
        const startContainer = range.startContainer;
        const startOffset = range.startOffset;

        let startIndex = -1;

        if (startContainer.nodeType === Node.TEXT_NODE) {
            startIndex = Array.from(ayahText.split("")).reduce((acc, char, index) => {
                return acc + (index === startOffset ? startOffset : 0);
            }, 0);
        }

        if (startIndex === -1 || ayahText.substring(startIndex, startIndex + selectedText.length) !== selectedText) {
            alert("Error: Selected text not found in the verse.");
            return;
        }

        const mistakeIndexes = [];
        for (let i = startIndex; i < startIndex + selectedText.length; i++) {
            mistakeIndexes.push(i);
        }

        try {
            const response = await fetch("/addMistake", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ current_posStr, mistakeIndexes }),
            });
            if (!response.ok) {
                throw new Error("Failed to add mistake");
            }
            setMistakes([...mistakes, ...mistakeIndexes]);
        } catch (error) {
            console.error("Error adding mistake:", error);
        }
    };

    const removeMistake = async () => {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) {
            alert("Please select text to remove as a mistake.");
            return;
        }

        const selectedText = selection.toString();
        if (!selectedText) {
            alert("Please select text to remove as a mistake.");
            return;
        }

        const ayahText = verse;
        const range = selection.getRangeAt(0);
        const startContainer = range.startContainer;
        const startOffset = range.startOffset;

        let startIndex = -1;

        if (startContainer.nodeType === Node.TEXT_NODE) {
            startIndex = Array.from(ayahText.split("")).reduce((acc, char, index) => {
                return acc + (index === startOffset ? startOffset : 0);
            }, 0);
        }

        if (startIndex === -1 || ayahText.substring(startIndex, startIndex + selectedText.length) !== selectedText) {
            alert("Error: Selected text not found in the verse.");
            return;
        }

        const mistakeIndexes = [];
        for (let i = startIndex; i < startIndex + selectedText.length; i++) {
            mistakeIndexes.push(i);
        }

        try {
            const response = await fetch("/removeMistake", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ current_posStr, mistakeIndexes }),
            });
            if (!response.ok) {
                throw new Error("Failed to remove mistake");
            }
            setMistakes(mistakes.filter(index => !mistakeIndexes.includes(index)));
        } catch (error) {
            console.error("Error removing mistake:", error);
        }
    };
    const trackNumberInput = (event) => {
        const newValue = event.target.value;
        setLoop(newValue);
    };

    return (
        <div className={`ayah-container ${isBookmarked ? "isBookmarked" : ""}`} data-url={current_posStr}>
            <div className="ayah-controls">
                <button
                    className="ayah-control-button"
                    data-loop={loop}
                    onClick={playAudio}
                >
                    {currentAyah === current_posStr && isPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                    className="ayah-bookmark-button"
                    onClick={toggleBookmark}
                >
                    {isBookmarked ? "Unbookmark" : "Bookmark"}
                </button>
                <button
                    className="ayah-add-mistake-button"
                    onClick={addMistake}
                >
                    Add a Mistake
                </button>
                <button
                    className="ayah-remove-mistake-button"
                    onClick={removeMistake}
                >
                    Remove a Mistake
                </button>
            </div>

            <div className="ayah-con">
                <p className="ayah">
                    {verse.split("").map((char, i) =>
                        mistakes.includes(i) ? (
                            <span key={i} className="mistake">{char}</span>
                        ) : (
                            char
                        )
                    )}
                </p>
            </div>
            <div className="number-input-container">
                <p className="loop-counter" data-count="0" data-loop={loop}>0/{loop}</p>
                <input
                    type="number"
                    className="loop-number-input"
                    value={loop}
                    min="0"
                    max="100"
                    step="1"
                    onChange={trackNumberInput}
                />
            </div>
        </div>
    );
};

export default AyahContainer;
