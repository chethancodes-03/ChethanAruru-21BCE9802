/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import useWebSocket from '../hooks/useWebSocket'; // Ensure this path is correct

const GameWindow = () => {
    const [gameState, setGameState] = useState(null);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [validMoves, setValidMoves] = useState([]);
    const [moveHistory, setMoveHistory] = useState([]);

    const handleMessage = (data) => {
        const parsedData = JSON.parse(data);
        if (parsedData.type === 'GAME_STATE') {
            setGameState(parsedData.gameState);
            setMoveHistory(parsedData.gameState.moveHistory);
        }
    };

    const sendMessage = useWebSocket('ws://localhost:5000', handleMessage);

    const handleCharacterClick = (character) => {
        const moves = getValidMoves(character);
        setValidMoves(moves);
        setSelectedCharacter(character);
    };

    const handleMove = (move) => {
        if (typeof sendMessage === 'function') {
            sendMessage(JSON.stringify({ type: 'MOVE', move }));
            setValidMoves([]);
            setSelectedCharacter(null);
        } else {
            console.error('sendMessage is not a function');
        }
    };

    const getValidMoves = (character) => {
        return [
            { x: 1, y: 2 },
            { x: 3, y: 4 }
        ];
    };

    return (
        <div className="game-window">
            <div className="grid grid-cols-5 gap-1">
                {gameState?.board.map((row, rowIndex) => (
                    <div key={rowIndex} className="grid-row">
                        {row.map((cell, cellIndex) => (
                            <div
                                key={cellIndex}
                                className={`cell ${cell.character ? cell.character.color : ''}`}
                                onClick={() => cell.character && handleCharacterClick(cell.character)}
                            >
                                {cell.character ? cell.character.name : ''}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="move-controls">
                {validMoves.length > 0 && (
                    <div>
                        <h2>Valid Moves</h2>
                        {validMoves.map((move, index) => (
                            <button key={index} onClick={() => handleMove(move)}>
                                Move to ({move.x}, {move.y})
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div className="move-history">
                <h2>Move History</h2>
                {moveHistory.map((move, index) => (
                    <div key={index}>{move}</div>
                ))}
            </div>
        </div>
    );
};

export default GameWindow;
