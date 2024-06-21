import React, { createContext, useContext, useState } from 'react';

const AudioPlayerContext = createContext();

export const useAudioPlayer = () => useContext(AudioPlayerContext);

export const AudioPlayerProvider = ({ children }) => {
    const [ayahUrl, setAyahUrl] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentAyah, setCurrentAyah] = useState(null);
    const [loopCount, setLoopCount] = useState(10); // Add state for loop count
    const [playCount, setPlayCount] = useState(0); // Add state for play count

    return (
        <AudioPlayerContext.Provider
            value={{
                ayahUrl,
                setAyahUrl,
                isPlaying,
                setIsPlaying,
                currentAyah,
                setCurrentAyah,
                loopCount,
                setLoopCount,
                playCount,
                setPlayCount // Ensure playCount state is provided
            }}
        >
            {children}
        </AudioPlayerContext.Provider>
    );
};
