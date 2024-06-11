import React from 'react';
import Header from './components/Header';
import AyahList from './components/AyahList';
import './App.css';
import './main.css';

function App() {
    return (
        <div className="App">
            <Header />
            <main>
                {/* Pass starting and ending positions as props to AyahList */}
                <AyahList start_pos="1:1" end_pos="2:5" />
            </main>
        </div>
    );
}

export default App;
