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

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.post('/api/create-room', async (req, res) => {
  try {
    const gameRoom = new GameRoom();
    await gameRoom.save();
    res.status(201).json(gameRoom);
  } catch (err) {
    res.status(500).json({ error: 'Error creating game room' });
  }
});

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


wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);
    // Handle incoming messages and game logic
    if (typeof message === 'string') {
      try{
        if (message){
          const data = JSON.parse(message);

          switch (data.type) {
              case 'JOIN_GAME':
                  // Add player to the game state
                  gameState.addPlayer(data.playerId, data.characters);
                  break;
              case 'MOVE':
                  // Process player move
                  gameState.makeMove(data.playerId, data.character, data.targetPosition);
                  break;
              // Add more cases as needed
          }

          // Broadcast updated game state to all players
          broadcastGameState();
          ws.send("Message received");
        }else{
          console.log('Received empty message');
        }
        
      }catch(error){
        console.error('Failed to parse message:', error);
      }
    }else{
      console.error('Invalid message type:', typeof message);
    }
    
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Existing MongoDB connection and Express routes...
function broadcastGameState() {
  const state = JSON.stringify({ type: 'GAME_STATE', gameState: gameState.getGameState() });
  wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
          client.send(state);
      }
  });
}


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
