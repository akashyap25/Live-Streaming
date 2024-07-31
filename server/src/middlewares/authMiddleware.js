const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error in authMiddleware:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

