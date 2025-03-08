import './App.css';
import Board from './Board';
import { games } from './games.js';
import { useState } from 'react';
import ErrorBoundary from "./ErrorBoundary.jsx";
function ClearState() {
    localStorage.setItem('selectedIndex', 0);
    localStorage.setItem('foundWords', JSON.stringify([]));
    return (
        <div>
            <h1>Something went wrong</h1>
            <button onClick={() => window.location.reload()}>Restart</button>
        </div>
    );
}
function App() {
    const [selectedIndex, setSelectedIndex] = useState(localStorage.getItem('selectedIndex') || 0);
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('reset')) {
        localStorage.setItem('selectedIndex', 0);
        localStorage.setItem('foundWords', JSON.stringify([]));
        // remove the query string
        window.history.replaceState({}, document.title, window.location.pathname);
        // reload the page to clear the query string
        window.location.reload();
    }
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
                <ErrorBoundary fallback={<ClearState />}>
                <Board
                    square={square}
                    words={words}
                    wordsInfo={wordsInfo}
                    size={size}
                />
                </ErrorBoundary>
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