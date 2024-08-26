class GameState {
    constructor() {
        // Initialize the game state
        this.board = this.initializeBoard(); // 5x5 grid
        this.players = {}; // Store player data
        this.turn = null; // Track whose turn it is
        this.moveHistory = []; // Track move history
        this.gameOver = false; // Flag to check if the game is over
    }

    initializeBoard() {
        // Set up initial positions of characters on the board
        const board = {};
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                board[`R${row}C${col}`] = null;
            }
        }
        return board;
    }

    addPlayer(playerId, characters) {
        // Add player to the game state
        this.players[playerId] = {
            characters: characters,
            positions: this.getInitialPositions(playerId, characters),
        };
        // Logic to decide the first player
        if (!this.turn) {
            this.turn = playerId;
        }
    }

    getInitialPositions(playerId, characters) {
        // Determine initial positions based on selected characters
        const startingRow = playerId === 'Player1' ? 0 : 4;
        return characters.reduce((positions, char, index) => {
            positions[char] = `R${startingRow}C${index}`;
            return positions;
        }, {});
    }

    makeMove(playerId, character, targetPosition) {
        if (this.isValidMove(playerId, character, targetPosition)) {
            const currentPosition = this.players[playerId].positions[character];
            this.board[currentPosition] = null; // Clear current position
            this.board[targetPosition] = { player: playerId, character: character }; // Set new position
            this.players[playerId].positions[character] = targetPosition; // Update character position

            // Add to move history
            this.moveHistory.push({ playerId, character, move: targetPosition });

            // Check if the game is over
            this.checkGameOver();

            // Switch turn
            this.switchTurn();
        }
    }

    isValidMove(playerId, character, targetPosition) {
        const characterPosition = this.players[playerId].positions[character];

        // Check if target position is within the board
        if (!this.board.hasOwnProperty(targetPosition)) {
            return false;
        }

        // Check if the move is not to the current position
        if (characterPosition === targetPosition) {
            return false;
        }

        // Check if target position is occupied by an opponent's character
        const targetCell = this.board[targetPosition];
        if (targetCell && targetCell.player !== playerId) {
            return false;
        }

        // Placeholder for character-specific move validation
        // For now, let's assume any move within the board is valid
        return true;
    }

    switchTurn() {
        // Switch turn to the other player
        this.turn = this.turn === 'Player1' ? 'Player2' : 'Player1';
    }

    checkGameOver() {
        // Check if one player has no remaining characters and end the game
        const player1HasCharacters = Object.values(this.players['Player1'].positions).some(position => this.board[position]?.player === 'Player1');
        const player2HasCharacters = Object.values(this.players['Player2'].positions).some(position => this.board[position]?.player === 'Player2');

        if (!player1HasCharacters) {
            this.gameOver = true;
            console.log('Player 2 wins!');
        } else if (!player2HasCharacters) {
            this.gameOver = true;
            console.log('Player 1 wins!');
        }
    }

    getGameState() {
        // Return the current game state for sending to the clients
        return {
            board: this.board,
            players: this.players,
            turn: this.turn,
            moveHistory: this.moveHistory,
            gameOver: this.gameOver,
        };
    }
}

module.exports = GameState;
