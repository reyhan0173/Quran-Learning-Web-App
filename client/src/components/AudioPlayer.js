import React, { useEffect, useRef, useState } from 'react';
import { useAudioPlayer } from './AudioPlayerContext'; // Import the context

const AudioPlayer = () => {
    const { ayahUrl, isPlaying, setIsPlaying, currentAyah, loopCount, playCount, setPlayCount } = useAudioPlayer();
    const audioRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const audioElement = audioRef.current;

        if (audioElement) {
            const handleLoadedMetadata = () => {
                setDuration(audioElement.duration);
            };

            const handleTimeUpdate = () => {
                setCurrentTime(audioElement.currentTime);
            };

            const handleEnded = () => {
                if (playCount < loopCount - 1) {
                    setPlayCount((prevCount) => prevCount + 1);
                    audioElement.play();
                } else {
                    setIsPlaying(false);
                    setPlayCount(0); // Reset play count when done looping
                }
            };

            audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
            audioElement.addEventListener('timeupdate', handleTimeUpdate);
            audioElement.addEventListener('ended', handleEnded);

            return () => {
                audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
                audioElement.removeEventListener('timeupdate', handleTimeUpdate);
                audioElement.removeEventListener('ended', handleEnded);
            };
        }
    }, [ayahUrl, isPlaying, setIsPlaying, playCount, loopCount]);

    useEffect(() => {
        const audioElement = audioRef.current;

        if (audioElement && ayahUrl) {
            if (currentAyah) {
                if (audioElement.src !== ayahUrl) {
                    audioElement.src = ayahUrl;
                    audioElement.play();
                } else {
                    if (isPlaying) {
                        audioElement.play();
                    } else {
                        audioElement.pause();
                    }
                }
            } else {
                audioElement.src = ayahUrl;
                audioElement.play();
            }
        }
    }, [ayahUrl, isPlaying, currentAyah]);

    const handlePlayPause = () => {
        const audioElement = audioRef.current;

        if (audioElement.paused) {
            audioElement.play();
            setIsPlaying(true);
        } else {
            audioElement.pause();
            setIsPlaying(false);
        }
    };

    const handleSeek = (event) => {
        const audioElement = audioRef.current;
        const seekTime = (event.target.value / 100) * audioElement.duration;
        audioElement.currentTime = seekTime;
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    return (
        <div className="single-player-2">
            <input
                type="range"
                id="seekBar"
                value={(currentTime / duration) * 100 || 0}
                onChange={handleSeek}
            />
            <div className="timeRange">
                <div className="currentTime" id="currentTime">
                    {formatTime(currentTime)}
                </div>
                <button
                    id="playPauseBtn"
                    className="playPauseBtn icon-Btn"
                    onClick={handlePlayPause}
                    disabled={!ayahUrl} // Disable button if no ayahUrl
                >
                    <i className={`fa fa-${isPlaying ? 'pause' : 'play'} ${isPlaying ? 'pause-icon' : 'play-icon'}`}></i>
                </button>
                <div className="totalDuration" id="totalDuration">
                    {formatTime(duration)}
                </div>
            </div>
            <audio
                id="audioPlayer"
                ref={audioRef}
                src=""
                controls
            >
                <source src type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
        </div>
    );
};

export default AudioPlayer;
