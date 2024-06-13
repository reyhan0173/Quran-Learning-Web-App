import React, { useEffect, useRef } from 'react';
import { useAudioPlayer } from './AudioPlayerContext'; // Import the context

const AudioPlayer = () => {
    const { ayahUrl, isPlaying, setIsPlaying, currentAyah } = useAudioPlayer(); // Destructure values from the context
    const audioRef = useRef(null);

    useEffect(() => {
        const audioElement = audioRef.current;

        if (audioElement && ayahUrl) {
            audioElement.src = ayahUrl;
            if (isPlaying) {
                audioElement.play();
            } else {
                audioElement.pause();
            }
        }

        const handleEnded = () => {
            setIsPlaying(false);
        };

        audioElement.addEventListener('ended', handleEnded);

        return () => {
            audioElement.removeEventListener('ended', handleEnded);
        };
    }, [ayahUrl, isPlaying, setIsPlaying]);

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

    return (
        <div>
            <audio ref={audioRef} controls />
            <button onClick={handlePlayPause}>
                {isPlaying ? 'Pause' : 'Play'}
            </button>
        </div>
    );
};

export default AudioPlayer;
