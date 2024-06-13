import React from 'react';
import Header from './components/Header';
import AyahList from './components/AyahList';
import AudioRecorder from './components/AudioRecorder';
import AudioPlayer from './components/AudioPlayer';
import { AudioPlayerProvider } from './components/AudioPlayerContext';
import 'font-awesome/css/font-awesome.min.css';
import './App.css';
import './main.css';

function App() {
    return (
        <AudioPlayerProvider>
            <div className="App">
                <Header />
                <main>
                    <AyahList start_pos="1:1" end_pos="2:5" />
                    <AudioRecorder />
                    <AudioPlayer />
                </main>
            </div>
        </AudioPlayerProvider>
    );
}

export default App;
