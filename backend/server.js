
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
dotenv.config();
require('./models'); 
const { Team } = require('./models');
const app = express();
const server = http.createServer(app);

// Configure Express CORS
const allowedOrigins = process.env.CLIENT_URL.split(',');
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
     credentials: true 
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('refresh-teams', async () => {
    const teams = await Team.find().populate('scores');
    io.emit('teams-updated', teams);
  });

socket.on('team-update', (team) => {
    // broadcast the new current team to all clients
    io.emit('team-update', team);
  });

  socket.on('disconnect', () => console.log('Client disconnected'));
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());

// Routes
app.use('/api/judges', require('./routes/judges'));
app.use('/api/teams', require('./routes/teams'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/scores', require('./routes/scores'));

// Socket.io
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));