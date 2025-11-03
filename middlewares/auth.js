// middlewares/auth.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    // Check for 'Bearer <token>' in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            // Format: "Bearer <token>" -> split and get index [1]
            token = req.headers.authorization.split(' ')[1];

            // Verify token using JWT_SECRET
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach the user's ID (counselor ID) to the request object
            // This makes it available to route handlers as req.user
            req.user = decoded.id;

            // Move to the next middleware or route handler
            next();

        } catch (error) {
            console.error('JWT Error:', error.message);
            return res.status(401).json({ 
                message: 'Not authorized, token failed',
                error: error.message
            });
        }
    }

    // If no token is provided
    if (!token) {
        return res.status(401).json({ 
            message: 'Not authorized, no token provided' 
        });
    }
};

module.exports = protect;
