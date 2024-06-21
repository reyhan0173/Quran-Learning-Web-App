import React, { useState, useEffect, useRef } from 'react';
import { useAudioPlayer } from './AudioPlayerContext'; // Import the context

const RECITER = 3;

const AyahContainer = ({ ayahData }) => {
    const { current_posStr, verse, mistakes: initialMistakes, isBookmarked: initialIsBookmarked } = ayahData;
    const [mistakes, setMistakes] = useState(initialMistakes);
    const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
    const [loop, setLoop] = useState(10); // Set initial loop value to 10

    const {
        currentAyah,
        isPlaying,
        setAyahUrl,
        setCurrentAyah,
        setIsPlaying,
        setLoopCount,
        playCount, // Ensure playCount is destructured from context
        setPlayCount // Ensure setPlayCount is destructured from context
    } = useAudioPlayer(); // Destructure context values

    const audioElement = useRef(null); // Ref for the audio element

    useEffect(() => {
        setMistakes(initialMistakes);
        setIsBookmarked(initialIsBookmarked);
    }, [initialMistakes, initialIsBookmarked]);

    useEffect(() => {
        const fetchBookmarkState = async () => {
            try {
                const response = await fetch(`http://localhost:501/checkBookmark`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ current_posStr }),
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch bookmark state");
                }
                const { isBookmarked } = await response.json();
                setIsBookmarked(isBookmarked);
            } catch (error) {
                console.error("Error fetching initial bookmark state:", error);
            }
        };

        fetchBookmarkState();
    }, [current_posStr]);

    // Handle play/pause button click
    const handlePlayPause = async () => {
        const ayahId = current_posStr;

        if (currentAyah === ayahId) {
            setIsPlaying((prev) => !prev);
        } else {
            const audioUrl = await fetchAudioUrl(ayahId, RECITER);
            setAyahUrl(audioUrl);
            setCurrentAyah(ayahId);
            setIsPlaying(true);
            setPlayCount(0); // Reset play count when a new Ayah is played
        }
        setLoopCount(loop); // Set the loop count when play is clicked
    };

    // Fetch audio URL for the given ayah
    const fetchAudioUrl = async (ayahId, reciter) => {
        const api = `https://api.quran.com/api/v4/recitations/${reciter}/by_ayah/${ayahId}`;
        try {
            const response = await fetch(api);
            const data = await response.json();
            const directory = data.audio_files[0].url;
            const audioUrl = `https://verses.quran.com/${directory}`;
            return audioUrl;
        } catch (error) {
            console.error("Error fetching audio URL:", error);
            throw new Error("Failed to fetch audio URL");
        }
    };

    // Toggle bookmark state
    const toggleBookmark = async () => {
        try {
            const endpoint = isBookmarked ? "http://localhost:501/removeBookmark" : "http://localhost:501/addBookmark";
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
            setIsBookmarked(!isBookmarked); // Toggle the bookmark state
        } catch (error) {
            console.error(`Error ${isBookmarked ? "removing" : "adding"} bookmark:`, error);
        }
    };

    // Add mistake to the current ayah
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

        const ayahElement = document.querySelector(`[data-url='${current_posStr}'] .ayah`);
        if (!ayahElement) {
            alert("Error: Could not find the selected verse.");
            return;
        }

        const range = selection.getRangeAt(0);
        const startContainer = range.startContainer;
        const startOffset = range.startOffset;

        if (startContainer.nodeType !== Node.TEXT_NODE || !ayahElement.contains(startContainer)) {
            alert("Error: Selected text is not within the correct verse.");
            return;
        }

        let startIndex = 0;
        let currentNode = startContainer;

        while (currentNode && currentNode !== ayahElement) {
            if (currentNode.previousSibling) {
                currentNode = currentNode.previousSibling;
                startIndex += currentNode.textContent.length;
            } else {
                currentNode = currentNode.parentNode;
            }
        }
        startIndex += startOffset;

        const ayahText = verse;
        if (startIndex === -1 || ayahText.substring(startIndex, startIndex + selectedText.length) !== selectedText) {
            alert("Error: Selected text not found in the verse.");
            return;
        }

        const mistakeIndexes = [];
        for (let i = startIndex; i < startIndex + selectedText.length; i++) {
            mistakeIndexes.push(i);
        }

        try {
            const response = await fetch("http://localhost:501/addMistake", {
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

    // Remove mistake from the current ayah
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

        const ayahElement = document.querySelector(`[data-url='${current_posStr}'] .ayah`);
        if (!ayahElement) {
            alert("Error: Could not find the selected verse.");
            return;
        }

        const range = selection.getRangeAt(0);
        const startContainer = range.startContainer;
        const startOffset = range.startOffset;

        if (startContainer.nodeType !== Node.TEXT_NODE || !ayahElement.contains(startContainer)) {
            alert("Error: Selected text is not within the correct verse.");
            return;
        }

        let startIndex = 0;
        let currentNode = startContainer;

        while (currentNode && currentNode !== ayahElement) {
            if (currentNode.previousSibling) {
                currentNode = currentNode.previousSibling;
                startIndex += currentNode.textContent.length;
            } else {
                currentNode = currentNode.parentNode;
            }
        }
        startIndex += startOffset;

        const ayahText = ayahElement.textContent;
        if (startIndex === -1 || ayahText.substring(startIndex, startIndex + selectedText.length) !== selectedText) {
            alert("Error: Selected text not found in the verse.");
            return;
        }

        const mistakeIndexes = [];
        for (let i = startIndex; i < startIndex + selectedText.length; i++) {
            mistakeIndexes.push(i);
        }

        try {
            const response = await fetch("http://localhost:501/removeMistake", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ current_posStr, mistakeIndexes }),
            });
            if (!response.ok) {
                throw new Error("Failed to remove mistake");
            }

            setMistakes(prevMistakes => prevMistakes.filter(index => !mistakeIndexes.includes(index)));
            alert("Mistake removed successfully");
        } catch (error) {
            console.error("Error removing mistake:", error);
        }
    };

    // Track number input change for loop
    const trackNumberInput = (event) => {
        const newValue = parseInt(event.target.value, 10);
        setLoop(newValue);
        setLoopCount(newValue);
    };

    // Effect to increment play count when audio ends
    useEffect(() => {
        const handleAudioEnded = () => {
            if (currentAyah === current_posStr && isPlaying) {
                setPlayCount(prevCount => prevCount + 1);
            }
        };

        // Add event listener for 'ended' event
        if (audioElement.current) {
            audioElement.current.addEventListener('ended', handleAudioEnded);
        }

        // Clean up: Remove event listener when component unmounts or dependencies change
        return () => {
            if (audioElement.current) {
                audioElement.current.removeEventListener('ended', handleAudioEnded);
            }
        };
    }, [currentAyah, current_posStr, isPlaying, setPlayCount]);

    return (
        <div className={`ayah-container ${isBookmarked ? "isBookmarked" : ""}`} data-url={current_posStr}>
            <div className="ayah-controls">
                <button
                    className="ayah-control-button"
                    data-loop={loop}
                    onClick={handlePlayPause}
                >
                    {currentAyah === current_posStr && isPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                    className="ayah-bookmark-button"
                    onClick={toggleBookmark}
                >
                    {isBookmarked ? "Remove Bookmark" : "Bookmark"}
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
                <p className="loop-counter">{playCount}/{loop}</p> {/* Display play count */}
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
            <audio ref={audioElement} src="" />
        </div>
    );
};

export default AyahContainer;
