const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

const app = express();
app.use(cors());
app.use(express.json());

const GameState = require('./GameState');
const GameRoom = require('./models/GameRoom');

const mongoURI = "mongodb://127.0.0.1:27017/";
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const gameState = new GameState();

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Serve basic endpoint
app.get('/', (req, res) => {
  res.send('Server is running');
});

// API to create a new game room
app.post('/api/create-room', async (req, res) => {
  try {
    const gameRoom = new GameRoom();
    await gameRoom.save();
    res.status(201).json(gameRoom);
  } catch (err) {
    res.status(500).json({ error: 'Error creating game room' });
  }
});

// API to join an existing game room
app.post('/api/join-room/:roomId', async (req, res) => {
  const { roomId } = req.params;
  try {
    const gameRoom = await GameRoom.findById(roomId);
    if (!gameRoom) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (gameRoom.players.length < 2) {
      gameRoom.players.push(req.body.playerName);
      await gameRoom.save();
      res.status(200).json(gameRoom);
    } else {
      res.status(400).json({ error: 'Room is full' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error joining game room' });
  }
});

// WebSocket handling
wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      switch (data.type) {
        case 'JOIN_GAME':
          gameState.addPlayer(data.playerId, data.characters);
          break;
        case 'MOVE':
          gameState.makeMove(data.playerId, data.character, data.targetPosition);
          break;
        default:
          console.log('Unknown message type:', data.type);
      }

      // Broadcast updated game state to all players
      broadcastGameState();
    } catch (error) {
      console.error('Failed to process message:', error);
      ws.send(JSON.stringify({ type: 'ERROR', message: 'Invalid message format' }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Function to broadcast the current game state to all connected clients
function broadcastGameState() {
  const state = JSON.stringify({ type: 'GAME_STATE', gameState: gameState.getGameState() });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(state);
    }
  });
}

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
