const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const winston = require('winston');

// Define a logger for the auth controller
const authLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/auth.log' }),
  ],
});

exports.signup = async (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ firstname, lastname, username, email, password: hashedPassword });
    await user.save();
    authLogger.info('User created successfully', { username: user.username, email: user.email });
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    authLogger.error('Error creating user', { error: error.message });
    res.status(400).json({ error: 'Error creating user' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }


    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    authLogger.info('User logged in successfully', { username: user.username });
    res.json({ token });
  } catch (error) {
    authLogger.error('Error logging in', { error: error.message });
    res.status(400).json({ error: 'Error logging in' });
  }
};
