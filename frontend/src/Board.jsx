import {useCallback, useEffect, useState, useMemo} from "react";
import PropTypes from "prop-types";
import Tile from "./Tile";

const Board = ({square, words, wordsInfo, size}) => {
    const generateArray = (rows, cols, initialValue = true) =>
        Array.from({length: rows}, () => Array(cols).fill(initialValue));

    const board = useMemo(() =>
        square.toUpperCase().split('-').map(row => row.split('')), [square]);

    const [isAnimating, setIsAnimating] = useState("none");
    const [selectedPath, setSelectedPath] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [currentWord, setCurrentWord] = useState("-");
    const [defaultStyle, setDefaultStyle] = useState(generateArray(size, size));
    const [currentTile, setCurrentTile] = useState(null);
    const [showFoundWords, setShowFoundWords] = useState(false);

    const foundWords = JSON.parse(localStorage.getItem("foundWords") || "[]");
    const [points, setPoints] = useState(foundWords.reduce((a, b) => a + b.length, 0));

    const initializeFrequencies = useCallback((wordsInfo, foundWords) => {
        const cellFreq = generateArray(size, size, 0);
        const startFreq = generateArray(size, size, 0);
        for (const word in wordsInfo) {
            if (foundWords.includes(word.toUpperCase())) {
                continue;
            }
            const path = wordsInfo[word];
            for (const [c, r] of path) cellFreq[r][c] += 1;
            const [c, r] = path[0];
            startFreq[r][c] += 1;
        }
        return {cellFreq, startFreq};
    }, [size]);

    const {cellFreq, startFreq} = useMemo(() =>
        initializeFrequencies(wordsInfo, foundWords), [wordsInfo, foundWords, initializeFrequencies, board]);

    const [cellFrequencies, setCellFrequencies] = useState(cellFreq);
    const [startFrequencies, setStartFrequencies] = useState(startFreq);
    useEffect(() => {
        setPoints(0); // Reset points when the square changes
        updateFrequencies(foundWords);
        setCurrentWord("-");
    }, [square]);
    const setDefaultStyleAt = (rowIndex, colIndex, value) => {
        setDefaultStyle(prev =>
            prev.map((row, rIndex) =>
                row.map((cell, cIndex) =>
                    rIndex === rowIndex && cIndex === colIndex ? value : cell
                )
            )
        );
    };

    const setDefaultStyleAll = value => {
        setDefaultStyle(generateArray(size, size, value));
    };

    const onMouseDown = (rowIndex, colIndex) => {
        setIsDragging(true);
        setSelectedPath([[rowIndex, colIndex]]);
        setDefaultStyleAt(rowIndex, colIndex, false);
    };

    const onMouseMove = useCallback((rowIndex, colIndex) => {
        if (!isDragging) return;
        setSelectedPath(prevPath => {
            const lastPos = prevPath[prevPath.length - 1];
            const newPos = [rowIndex, colIndex];
            const existingIndex = prevPath.findIndex(pos => JSON.stringify(pos) === JSON.stringify(newPos));
            if (existingIndex !== -1) {
                const newPath = prevPath.slice(0, existingIndex + 1);
                const deletePath = prevPath.slice(existingIndex + 1);
                deletePath.forEach(([r, c]) => setDefaultStyleAt(r, c, true));
                setCurrentWord(newPath.map(([r, c]) => board[r][c]).join(''));
                return newPath;
            }
            if (Math.abs(lastPos[0] - rowIndex) <= 1 && Math.abs(lastPos[1] - colIndex) <= 1) {
                setCurrentWord(prevPath.map(([r, c]) => board[r][c]).join('') + board[rowIndex][colIndex]);
                setDefaultStyleAt(rowIndex, colIndex, false);
                return [...prevPath, newPos];
            }
            return prevPath;
        });
    }, [isDragging, board]);

    useEffect(() => {
        const handleTouchMove = e => {
            e.preventDefault();
            const touch = e.touches[0];
            const element = document.elementFromPoint(touch.clientX, touch.clientY);
            if (element && element !== currentTile) {
                setCurrentTile(element);
                if (element.dataset.key) {
                    const [rowIndex, colIndex] = element.dataset.key.split('-').map(Number);
                    setIsDragging(true);
                    onMouseMove(rowIndex, colIndex);
                }
            }
        };
        document.addEventListener("touchmove", handleTouchMove);
        return () => {
            document.removeEventListener("touchmove", handleTouchMove);
        };
    }, [currentTile, onMouseMove]);

    const wordIsValid = word => words.includes(word.toLowerCase());

    const updateFrequencies = foundWords => {
        const {cellFreq, startFreq} = initializeFrequencies(wordsInfo, foundWords);
        setCellFrequencies(cellFreq);
        setStartFrequencies(startFreq);
    };

    const onMouseUp = () => {
        setDefaultStyleAll(true);
        setIsDragging(false);
        setSelectedPath([]);
        const selectedWord = selectedPath.map(([r, c]) => board[r][c]).join('');
        if (wordIsValid(selectedWord)) {
            if (foundWords.includes(selectedWord)) {
                setCurrentWord("Redan hittat.");
                setTimeout(() => setCurrentWord("-"), 1400);
                return;
            }
            const newFoundWords = [...foundWords, selectedWord];
            localStorage.setItem("foundWords", JSON.stringify(newFoundWords));
            setPoints(newFoundWords.reduce((a, b) => a + b.length, 0));
            updateFrequencies(newFoundWords);
            setIsAnimating('correct');
        } else {
            setIsAnimating('incorrect');
        }
        setTimeout(() => setIsAnimating('none'), 1000);
    };

    const handleMouseLeave = () => {
        setDefaultStyleAll(true);
        setSelectedPath([]);
        if (isDragging) {
            setIsDragging(false);
            onMouseUp();
        }
    };

    const groupWordsByLength = (wordList) => {
        return wordList.reduce((acc, word) => {
            const length = word.length;
            if (!acc[length]) {
                acc[length] = [];
            }
            acc[length].push(word);
            return acc;
        }, {});
    };

    const countWordsLeft = (allWords, foundWords) => {
        const groupedAllWords = groupWordsByLength(allWords);
        const groupedFoundWords = groupWordsByLength(foundWords);
        return Object.keys(groupedAllWords).reduce((acc, length) => {
            const total = groupedAllWords[length].length;
            const found = groupedFoundWords[length] ? groupedFoundWords[length].length : 0;
            acc[length] = total - found;
            return acc;
        }, {});
    };
    const groupedFoundWords = groupWordsByLength(foundWords);
    const groupedWords = groupWordsByLength(words);
    const wordsLeftCount = countWordsLeft(words, foundWords);
    const renderPath = () => {
        if (selectedPath.length <= 1) return null;
        const mul = 130, xadd = 58, yadd = 63, color = "#192843", width = 20;
        return selectedPath.map((pos, index) => (
            <>
                <line
                    key={index}
                    x1={pos[1] * mul + xadd}
                    y1={pos[0] * mul + yadd}
                    x2={(selectedPath[index + 1] ? selectedPath[index + 1][1] : pos[1]) * mul + xadd}
                    y2={(selectedPath[index + 1] ? selectedPath[index + 1][0] : pos[0]) * mul + yadd}
                    stroke={color}
                    strokeWidth={width}
                    opacity={0.45}
                />
                <circle
                    r={width / 2}
                    cx={(selectedPath[index + 1] ? selectedPath[index + 1][1] : pos[1]) * mul + xadd}
                    cy={(selectedPath[index + 1] ? selectedPath[index + 1][0] : pos[0]) * mul + yadd}
                    fill={color}
                    opacity={0.45}
                />
            </>
        ));
    };

    return (
        <div style={{alignItems: "center", justifyContent: "center"}}>
            <div style={{display: "grid", justifyContent: "center", alignItems: "center", columnGap: 50}}>
                <button
                    style={{
                    gridColumn: 1,
                    gridRow: 1,
                }}
                    className="text-button"
                        onClick={() => setShowFoundWords(!showFoundWords)}
                >
                    {foundWords.length} / {words.length} Ord
                </button>
                <div style={{
                    gridColumn: 2,
                    gridRow: 1, position: 'relative'
                }}>
                    <h1 className="score old-score">{points} Poäng</h1>
                    <h1
                        style={{opacity: isAnimating === 'correct' ? 1 : 0}}
                        className={`score animated-score ${isAnimating === 'correct' ? "correct-animation" : ''}`}
                    >
                        {points} Poäng
                    </h1>
                </div>
            </div>
            {showFoundWords && (
                <div className="found-words-list">
                    {Object.keys(groupedWords).map(length => (
                        <div key={length}>
                            <h3>Length {length} ({wordsLeftCount[length] ?? 0} left)</h3>
                            {(groupedFoundWords[length] || []).map((word, index) => (
                                    <span key={index}>{word},&nbsp;</span>
                                ))}
                        </div>
                    ))}
                </div>
            )}
            <div className="score-wrapper">
                <h1 className={isAnimating === 'incorrect' ? "shaking-fade" : ""}>{currentWord}</h1>
            </div>
            <div style={{position: "relative", margin: "10px 95px"}}>
                <svg
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        zIndex: 1,
                        pointerEvents: "none",
                        radius: "5px"
                    }}
                >
                    <filter id="constantOpacity">
                        <feComponentTransfer>
                            <feFuncA type="table" tableValues="0 .5 .5"/>
                        </feComponentTransfer>
                    </filter>
                    <g filter="url(#constantOpacity)">
                        {renderPath()}
                    </g>
                </svg>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${size}, 114px)`,
                        rowGap: "15px",
                        columnGap: "15px",
                    }}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={onMouseUp}
                    onTouchEnd={onMouseUp}
                >
                    {board.map((row, rowIndex) =>
                        row.map((char, colIndex) => (
                            <Tile
                                dataKey={`${rowIndex}-${colIndex}`}
                                key={`${rowIndex}-${colIndex}`}
                                onMouseDown={() => onMouseDown(rowIndex, colIndex)}
                                onMouseMove={() => onMouseMove(rowIndex, colIndex)}
                                onMouseUp={onMouseUp}
                                defaultStyle={defaultStyle[rowIndex][colIndex]}
                                cellFrequency={cellFrequencies[rowIndex][colIndex]}
                                startFrequency={startFrequencies[rowIndex][colIndex]}
                            >
                                {char}
                            </Tile>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

Board.propTypes = {
    square: PropTypes.string.isRequired,
    words: PropTypes.array.isRequired,
    wordsInfo: PropTypes.object.isRequired,
    size: PropTypes.number.isRequired,
};

export default Board;