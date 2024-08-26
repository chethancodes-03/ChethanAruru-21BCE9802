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
        // Example: { R0C0: { player: 'Player1', character: 'P' }, ... }
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
        // Example logic: Player1 characters on R0, Player2 on R4
        const startingRow = playerId === 'Player1' ? 0 : 4;
        return characters.map((char, index) => `R${startingRow}C${index}`);
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
        // Validate if the move is within the game rules
        return true; // Placeholder logic
    }

    switchTurn() {
        // Switch turn to the other player
        this.turn = this.turn === 'Player1' ? 'Player2' : 'Player1';
    }

    checkGameOver() {
        // Check if one player has no remaining characters and end the game
        // Set this.gameOver to true if the game is over
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
