/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
const CharacterSelection = ({ onSelectionComplete }) => {
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

  const isValidSelection = () => {
    // Check for at least one of each character type
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
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-2"
          >
            {char}
          </button>
        ))}
      </div>
      <div className="mb-4">
        <button
          onClick={handleUndo}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded m-2"
        >
          Undo
        </button>
        <button
          onClick={handleReset}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded m-2"
        >
          Refresh
        </button>
      </div>
      <div className="mb-4">
        <p>Selected Characters: {selectedCharacters.join(', ')}</p>
      </div>
      {isValidSelection() && (
        <button
          onClick={() => onSelectionComplete(selectedCharacters)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Go to Game
        </button>
      )}
    </div>
  );
};

CharacterSelection.propTypes = {
    onSelectionComplete: PropTypes.func.isRequired, // Define the type of the prop
  };

export default CharacterSelection;