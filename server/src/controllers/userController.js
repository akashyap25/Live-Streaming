const User = require('../models/User');
const logger = require('../logger'); // Import the Winston logger

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      logger.warn(`User profile not found for userId: ${req.user.userId}`);
      return res.status(404).json({ error: 'User profile not found' });
    }
    logger.info(`User profile fetched successfully for userId: ${req.user.userId}`);
    res.json(user);
  } catch (error) {
    logger.error(`Error fetching user profile for userId: ${req.user.userId}`, error);
    res.status(400).json({ error: 'Error fetching user profile' });
  }
};
