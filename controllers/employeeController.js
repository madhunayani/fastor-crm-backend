// controllers/employeeController.js
const jwt = require('jsonwebtoken');
const { Employee } = require('../models');

// Generate JWT Token
const generateToken = (id) => {
    const token = jwt.sign(
        { id: id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Token expires after 1 hour
    );
    return token;
};

// ============ REGISTER ============
// POST /api/employees/register
// Public route - no authentication required
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation: Check if all required fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Please provide name, email, and password'
            });
        }

        // Check if email already exists
        const existingEmployee = await Employee.findOne({ where: { email } });
        if (existingEmployee) {
            return res.status(409).json({
                message: 'Email address already registered'
            });
        }

        // Create new employee (password is hashed by Sequelize hook)
        const newEmployee = await Employee.create({
            name: name,
            email: email,
            password: password
        });

        // Generate JWT token
        const token = generateToken(newEmployee.id);

        // Return success response (password should NOT be sent back)
        res.status(201).json({
            message: 'Employee registered successfully',
            employee: {
                id: newEmployee.id,
                name: newEmployee.name,
                email: newEmployee.email,
                createdAt: newEmployee.createdAt
            },
            token: token
        });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({
            message: 'Server error during registration',
            error: error.message
        });
    }
};

// ============ LOGIN ============
// POST /api/employees/login
// Public route - no authentication required
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation: Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                message: 'Please provide email and password'
            });
        }

        // Find employee by email
        const employee = await Employee.findOne({ where: { email } });

        // If employee not found
        if (!employee) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        // Validate password using bcrypt comparison
        // This calls the validPassword method we defined in models/index.js
        const isPasswordValid = await employee.validPassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = generateToken(employee.id);

        // Return success response with token
        res.status(200).json({
            message: 'Login successful',
            employee: {
                id: employee.id,
                name: employee.name,
                email: employee.email
            },
            token: token
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({
            message: 'Server error during login',
            error: error.message
        });
    }
};

module.exports = { register, login };
