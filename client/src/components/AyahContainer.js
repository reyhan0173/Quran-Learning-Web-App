import React, { useState, useEffect, useRef } from 'react';
import { useAudioPlayer } from './AudioPlayerContext'; // Import the context
import { addMistake, removeMistake } from '../functions/mistakesFunctions';
import { toggleBookmark } from '../functions/bookmarkFunctions';

// 0: unloaded / paused
// 1: playing
// 2: increment

const RECITER = 7;

const AyahContainer = ({ studentId, courseId, ayahData }) => {
    const { current_posStr, verse, mistakes: initialMistakes, isBookmarked: initialIsBookmarked } = ayahData;
    const [mistakes, setMistakes] = useState(initialMistakes || []);
    const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked || 0);
    const [loopCount, setLoopCount] = useState(4);
    const [playCount, setPlayCount] = useState(0); // Local play count

    const {
        currentAyah,
        isPlaying,
        setAyahUrl,
        setCurrentAyah,
        setIsPlaying,
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

    useEffect(() => {
        // Increment play count only when the specific ayah is played
        if (currentAyah === current_posStr && isPlaying === 2) {
            setPlayCount(prevCount => prevCount + 1);
            if (playCount >= loopCount - 1) {
                setIsPlaying(0);
            } else {
                setIsPlaying(1);
            }
        }
    }, [isPlaying, currentAyah, current_posStr, playCount, loopCount, setIsPlaying]);

    const handlePlayPause = async () => {
        const ayahId = current_posStr;

        if (currentAyah === ayahId && isPlaying === 1) {
            setIsPlaying(0);
        } else {
            const audioUrl = await fetchAudioUrl(ayahId, RECITER);
            setAyahUrl(audioUrl);
            setCurrentAyah(ayahId);
            setIsPlaying(1);
        }
    };

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

    const trackNumberInput = (event) => {
        const newValue = parseInt(event.target.value, 10);
        setLoopCount(newValue);
    };

    const handleAddMistake = async () => {
        await addMistake(studentId, courseId, current_posStr, verse, mistakes, setMistakes);
    };

    const handleRemoveMistake = async () => {
        await removeMistake(studentId, courseId, current_posStr, setMistakes);
    };

    const handleToggleBookmark = async () => {
        await toggleBookmark(setIsBookmarked, isBookmarked, current_posStr);
    };

    return (
      <div
          className={`ayah-container ${isBookmarked ? "isBookmarked" : ""}`}
          data-url={current_posStr}
      >
          <div className="ayah-controls flex-col">
              <button
                className="ayah-control-button"
                data-loop={loopCount}
                onClick={handlePlayPause}
              >
                  <i className={currentAyah === current_posStr && isPlaying === 1 ? `fa fa-pause` : `fa fa-play`}></i>
              </button>
              <button
                className="ayah-bookmark-button"
                onClick={handleToggleBookmark}
              >
                  <i className={isBookmarked ? `fa fa-bookmark` :  `fa fa-bookmark-o`}></i>
              </button>
              <button
                className="ayah-add-mistake-button"
                onClick={handleAddMistake}
              >
                  <i className={`fas fa-pen`}></i>
              </button>
              <button
                className="ayah-remove-mistake-button"
                onClick={handleRemoveMistake}
              >
                  <i className={`fas fa-eraser`}></i>
              </button>
          </div>

          <div className="ayah-con">
              <p style={{
                  // fontFamily: 'Amiri, serif',
                  // fontFamily: 'Scheherazade New, serif',
                  // fontFamily: 'Lateef, serif',

                  fontSize: '24px', textAlign: 'right', direction: 'rtl'}}
                className={'quran-text'}
              >
                  {verse.split("").map((char, i) =>
                    mistakes.includes(i) ? (
                      <span key={i} className={"mistake"} style={{color: 'red'}}>{char}</span>
                    ) : (
                      char
                    )
                  )}
              </p>
          </div>
          <div className="number-input-container">
              <p className="loop-counter">{playCount}/{loopCount}</p>
              <input
                type="number"
                className="loop-number-input"
                value={loopCount}
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
