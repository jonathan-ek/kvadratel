import './App.css';
import Board from './Board';
import { games } from './games.js';
import { useState } from 'react';

function App() {
    const [selectedIndex, setSelectedIndex] = useState(localStorage.getItem('selectedIndex') || 0);

    const handleIndexChange = (index) => {
        if (index >= 0 && index < games.length) {
            setSelectedIndex(index);
            localStorage.setItem('selectedIndex', index);
            localStorage.setItem('foundWords', JSON.stringify([]));
        }
    };

    const { square, words, wordsInfo, size } = games[selectedIndex];

    return (
        <>
            <div>
                <h1>Kvadratel</h1>
            </div>
            <div className="game">
                <Board
                    square={square}
                    words={words}
                    wordsInfo={wordsInfo}
                    size={size}
                />
            </div>
            <div className="controls">
                <button onClick={() => handleIndexChange(selectedIndex - 1)} disabled={selectedIndex === 0}>
                    Previous
                </button>
                <button onClick={() => handleIndexChange(selectedIndex + 1)} disabled={selectedIndex === games.length - 1}>
                    Next
                </button>
            </div>
        </>
    );
}

export default App;