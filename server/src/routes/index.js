const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Auth Routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// User Routes
router.get('/profile', authMiddleware, userController.getProfile);

module.exports = router;
