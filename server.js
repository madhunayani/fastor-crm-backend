// server.js
const express = require('express');
const dotenv = require('dotenv');
const { sequelize } = require('./models');
const { testConnection } = require('./config/database');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// ========== ROUTES ==========
// Import route handlers
const employeeRoutes = require('./routes/employeeRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');

// Mount routes
app.use('/api/employees', employeeRoutes);
app.use('/api/enquiries', enquiryRoutes);

// Simple test route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Fastor CRM API is running',
        status: 'success',
        timestamp: new Date()
    });
});

// Initialize database and start server
const startServer = async () => {
    try {
        // Test database connection
        await testConnection();
        
        // Sync all models with database
        await sequelize.sync({ force: false });
        console.log('✅ All models synchronized with database.');
        
        // Start Express server
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
            console.log(`\n📚 API Documentation:`);
            console.log(`\n   EMPLOYEE ENDPOINTS:`);
            console.log(`   POST /api/employees/register - Register new employee`);
            console.log(`   POST /api/employees/login - Login employee`);
            console.log(`\n   ENQUIRY ENDPOINTS:`);
            console.log(`   POST /api/enquiries/public - Submit new enquiry (PUBLIC)`);
            console.log(`   GET /api/enquiries/public - Get unclaimed enquiries (PROTECTED)`);
            console.log(`   GET /api/enquiries/private - Get claimed enquiries (PROTECTED)`);
            console.log(`   PATCH /api/enquiries/:id/claim - Claim an enquiry (PROTECTED)`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Start the server
startServer();
