/* eslint-disable no-unused-expressions */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const CharacterSelection = ({ onSelectionComplete, playerId }) => {
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const characters = ['Pawn', 'Hero1', 'Hero2'];

  const handleCharacterSelect = (character) => {
    if (selectedCharacters.length < 5) {
      setSelectedCharacters([...selectedCharacters, character]);
    }
  };

  const handleUndo = () => {
    setSelectedCharacters(selectedCharacters.slice(0, -1));
  };

  const handleReset = () => {
    setSelectedCharacters([]);
  };

  const handleSelectionComplete = () => {
    if (isValidSelection()) {
       ({
        type: 'JOIN_GAME',
        playerId,
        characters: selectedCharacters,
      });
      onSelectionComplete(selectedCharacters);
    }
  };

  const isValidSelection = () => {
    const characterCount = selectedCharacters.reduce((count, char) => {
      count[char] = (count[char] || 0) + 1;
      return count;
    }, {});
    return (
      characterCount['Pawn'] >= 3 &&
      characterCount['Hero1'] >= 1 &&
      characterCount['Hero2'] >= 1
    );
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl mb-4">Select Your Characters</h2>
      <div className="mb-4">
        {characters.map((char) => (
          <button
            key={char}
            onClick={() => handleCharacterSelect(char)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
          >
            {char}
          </button>
        ))}
      </div>
      <div className="mb-4">
        <h3 className="text-xl">Selected Characters:</h3>
        <ul>
          {selectedCharacters.map((char, index) => (
            <li key={index}>{char}</li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <button onClick={handleUndo} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded m-2">
          Undo
        </button>
        <button onClick={handleReset} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded m-2">
          Reset
        </button>
      </div>
      <button
        onClick={handleSelectionComplete}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        disabled={!isValidSelection()}
      >
        Start Game
      </button>
    </div>
  );
};

CharacterSelection.propTypes = {
  onSelectionComplete: PropTypes.func.isRequired,
  playerId: PropTypes.string,
};

export default CharacterSelection;
