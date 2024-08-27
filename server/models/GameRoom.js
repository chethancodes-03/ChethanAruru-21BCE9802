const mongoose = require('mongoose');

const gameRoomSchema = new mongoose.Schema({
  players: {
    type: Array,
    default: [],
  },
  gameState: {
    type: String,
    default: 'waitingForPlayers',
  },
  moveHistory: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model('GameRoom', gameRoomSchema);
