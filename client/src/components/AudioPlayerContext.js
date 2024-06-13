import React, { createContext, useState, useContext } from 'react';

const AudioPlayerContext = createContext();

export const AudioPlayerProvider = ({ children }) => {
    const [currentAyah, setCurrentAyah] = useState(null);
    const [ayahUrl, setAyahUrl] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);

    const updateAyah = (ayah, url) => {
        if (ayah === currentAyah && isPlaying) {
            setIsPlaying(false);
        } else {
            setCurrentAyah(ayah);
            setAyahUrl(url);
            setIsPlaying(true);
        }
    };

    return (
        <AudioPlayerContext.Provider value={{ currentAyah, ayahUrl, isPlaying, updateAyah, setIsPlaying }}>
            {children}
        </AudioPlayerContext.Provider>
    );
};

export const useAudioPlayer = () => useContext(AudioPlayerContext);
