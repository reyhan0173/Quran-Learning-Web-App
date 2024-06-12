import React from 'react';
import Header from './components/Header';
import AyahList from './components/AyahList';
import AudioRecorder from './components/AudioRecorder';
import 'font-awesome/css/font-awesome.min.css';
import './App.css';
import './main.css';

function App() {
    return (
        <div className="App">
            <Header />
            <main>
                {/* Pass starting and ending positions as props to AyahList */}
                <AyahList start_pos="1:1" end_pos="2:5" />
                <AudioRecorder />
            </main>
        </div>
    );
}

export default App;
