/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import useWebSocket from '../hooks/useWebSocket'; // Custom hook for WebSocket

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

    const sendMessage = useWebSocket('ws://localhost:5000', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'GAME_STATE') {
          setGameState(data.gameState);
          setMoveHistory(data.gameState.moveHistory);
        }
      });
    
    useEffect(() => {
        // Effect to handle WebSocket messages if needed outside the hook's callback
        // Currently, all logic is handled within the hook's message handler.
        // Remove this effect if unnecessary.
      }, []); // Empty dependency array since WebSocket is managed within the hook
    

    const handleCharacterClick = (character) => {
        // Fetch valid moves for the selected character
        // Update state with valid moves
        setSelectedCharacter(character);
    };

    const handleMove = (move) => {
        // Send move to server via WebSocket
        sendMessage(JSON.stringify({ type: 'MOVE', move }));
    };

    return (
        <div className="game-window">
            <div className="grid grid-cols-5 gap-1">
                {/* Render game board here */}
            </div>
            <div className="move-controls">
                {/* Render valid moves and handle move actions */}
            </div>
            <div className="move-history">
                {/* Render move history */}
            </div>
        </div>
    );
};

export default GameWindow;