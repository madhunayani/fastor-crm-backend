// routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/employeeController');

/**
 * @route   POST /api/employees/register
 * @desc    Register a new employee/counselor
 * @access  Public (no authentication required)
 * @params  name, email, password
 */
router.post('/register', register);

/**
 * @route   POST /api/employees/login
 * @desc    Login employee/counselor
 * @access  Public (no authentication required)
 * @params  email, password
 */
router.post('/login', login);

module.exports = router;
