class GameState {
    constructor() {
        this.board = this.initializeBoard(); // 5x5 grid
        this.players = {}; // Store player data
        this.turn = null; // Track whose turn it is
        this.moveHistory = []; // Track move history
        this.gameOver = false; // Flag to check if the game is over
    }

    initializeBoard() {
        const board = {};
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                board[`R${row}C${col}`] = null;
            }
        }
        return board;
    }

    addPlayer(playerId, characters) {
        this.players[playerId] = {
            characters: characters,
            positions: this.getInitialPositions(playerId, characters),
        };

        if (!this.turn) {
            this.turn = playerId;
        }
    }

    getInitialPositions(playerId, characters) {
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

            this.moveHistory.push({ playerId, character, move: targetPosition });

            this.checkGameOver();

            this.switchTurn();
        }
    }

    isValidMove(playerId, character, targetPosition) {
        const characterPosition = this.players[playerId].positions[character];

        if (!this.board.hasOwnProperty(targetPosition)) {
            return false;
        }

        if (characterPosition === targetPosition) {
            return false;
        }

        const targetCell = this.board[targetPosition];
        if (targetCell && targetCell.player !== playerId) {
            return false;
        }

        return true;
    }

    switchTurn() {
        this.turn = this.turn === 'Player1' ? 'Player2' : 'Player1';
    }

    checkGameOver() {
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
