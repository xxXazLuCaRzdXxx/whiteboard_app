require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Adjust according to your frontend origin for production
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Listen for 'drawing' events from clients
  socket.on('drawing', (data) => {
    // Broadcast the drawing data to all other clients
    socket.broadcast.emit('drawing', data);
  });
  
  socket.on('undo', (data) => {
    socket.broadcast.emit('undo', data); // Broadcast an undo action
  });

  socket.on('redo', (data) => {
    socket.broadcast.emit('redo', data); // Broadcast a redo action
  });

  socket.on("globalundo",(data)=>{
    socket.broadcast.emit('globalundo', data);
  })

  socket.on('disconnect', () => console.log('User disconnected'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));