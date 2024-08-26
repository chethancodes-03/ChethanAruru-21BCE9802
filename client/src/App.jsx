// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import GameLobby from './GameLobby';
import CharacterSelection from './CharacterSelection';
import GameWindow from './components/GameWindow';

import socket from './websocket';  // Import the WebSocket service

function App() {
  const [gameState, setGameState] = useState('lobby');
  // eslint-disable-next-line no-unused-vars
  const [characters, setCharacters] = useState([]);

  const handleJoinGame = () => {
    setGameState('characterSelection');
  };

  const handleSelectionComplete = (selectedCharacters) => {
    setCharacters(selectedCharacters);
    setGameState('gameWindow');
  };

  useEffect(() => {
    // Additional setup or cleanup for WebSocket
    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="App">
      {gameState === 'lobby' && <GameLobby onJoinGame={handleJoinGame} />}
      {gameState === 'characterSelection' && (
        <CharacterSelection onSelectionComplete={handleSelectionComplete} />
      )}
      {gameState === 'gameWindow' && <GameWindow />}
    </div>
  );
}

export default App;