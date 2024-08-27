// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PropTypes from 'prop-types';
function GameLobby({ onJoinGame }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <h1 className="text-3xl mb-6">HitWicket Game Lobby</h1>
      <button 
        onClick={onJoinGame} 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Join Game
      </button>
    </div>
  );
}


GameLobby.propTypes = {
    onJoinGame: PropTypes.func.isRequired, // Define the type of the prop
};

export default GameLobby;