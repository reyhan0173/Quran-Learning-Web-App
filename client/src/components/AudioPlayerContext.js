import React, { createContext, useContext, useState } from 'react';

const AudioPlayerContext = createContext();

export const useAudioPlayer = () => useContext(AudioPlayerContext);

export const AudioPlayerProvider = ({ children }) => {
    const [ayahUrl, setAyahUrl] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentAyah, setCurrentAyah] = useState(null);

    return (
        <AudioPlayerContext.Provider
            value={{
                ayahUrl,
                setAyahUrl,
                isPlaying,
                setIsPlaying,
                currentAyah,
                setCurrentAyah,
            }}
        >
            {children}
        </AudioPlayerContext.Provider>
    );
};
