const { Server } = require('socket.io');
const http = require('http');
const express = require('express');
const multer = require('multer');
const upload = multer();
const winston = require('winston');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', 
  },
});


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

io.on('connection', (socket) => {
  logger.info('New client connected');

  socket.on('stream', (data) => {
    logger.info('Received stream data');

    // Uncomment the following line to log the data in console
    //logger.info('Received stream data',data);

    socket.emit('status', 'Stream data received');
  });

  socket.on('chatMessage', (msg) => {
    logger.info('Received chat message', { message: msg });
    io.emit('chatMessage', msg); 
  });

  socket.on('disconnect', () => {
    logger.info('Client disconnected');
  });
});

module.exports = { app, server, io };
