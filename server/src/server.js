const { app, server } = require('./socket'); // Import the WebSocket server setup
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const logger = require('./logger'); // Import the Winston logger
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

// Middleware to use logger in requests
app.use((req, res, next) => {
  req.logger = logger;
  next();
});

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch(err => {
    logger.error('Error connecting to MongoDB:', err);
  });

const routes = require('./routes');
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  req.logger.error(err.message, { stack: err.stack });
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
