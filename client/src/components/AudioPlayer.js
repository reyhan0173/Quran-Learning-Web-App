import React, { useEffect, useRef, useState } from 'react';
import { useAudioPlayer } from './AudioPlayerContext';

const AudioPlayer = () => {
    const { ayahUrl, isPlaying, setIsPlaying, currentAyah } = useAudioPlayer();
    const audioRef = useRef(null);
    const [ currentTime, setCurrentTime ] = useState(0);
    const [ duration, setDuration ] = useState(0);

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
                console.log(`Audio ended for Ayah: ${currentAyah}`);
                setIsPlaying(2);

                if (audioElement && isPlaying === 1) {
                    audioElement.currentTime = 0;
                    audioElement.play();
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
    }, [ayahUrl, isPlaying, setIsPlaying, currentAyah]);

    useEffect(() => {
        const audioElement = audioRef.current;
        if (isPlaying === 0) {
            audioElement.pause();
        }

        if (audioElement && ayahUrl) {
            if (currentAyah) {
                if (audioElement.src !== ayahUrl) {
                    audioElement.src = ayahUrl;
                    audioElement.play();
                    setIsPlaying(1);
                } else {
                    if (isPlaying === 1) {
                        audioElement.play();
                    }
                }
            } else {
                audioElement.src = ayahUrl;
                audioElement.play();
                setIsPlaying(1);
            }
        }
    }, [ayahUrl, isPlaying, currentAyah]);

    const handlePlayPause = () => {
        const audioElement = audioRef.current;

        if (audioElement.paused) {
            audioElement.play();
            setIsPlaying(1);
        } else {
            audioElement.pause();
            setIsPlaying(0);
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
                  <i className={`fa fa-${isPlaying === 1 ? 'pause' : 'play'} ${isPlaying === 1 ? 'pause-icon' : 'play-icon'}`}></i>
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
