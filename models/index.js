// models/index.js
const { sequelize } = require('../config/database');
const bcrypt = require('bcrypt');

// Import model definitions
const EmployeeModel = require('./employee');
const EnquiryModel = require('./enquiry');

// Initialize models
const Employee = EmployeeModel(sequelize);
const Enquiry = EnquiryModel(sequelize);

// Define associations/relationships
// One-to-Many: One Employee (Counselor) can have many Enquiries
Employee.hasMany(Enquiry, {
    foreignKey: 'counselorId',
    as: 'enquiries',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});

Enquiry.belongsTo(Employee, {
    foreignKey: 'counselorId',
    as: 'counselor',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});

// ===== HOOKS FOR PASSWORD HASHING =====
// Hash password before creating a new employee
Employee.beforeCreate(async (employee, options) => {
    if (employee.password) {
        const salt = await bcrypt.genSalt(10);
        employee.password = await bcrypt.hash(employee.password, salt);
    }
});

// Hash password before updating an employee (if password is modified)
Employee.beforeUpdate(async (employee, options) => {
    if (employee.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        employee.password = await bcrypt.hash(employee.password, salt);
    }
});

// Add instance method to validate password
Employee.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Export models and sequelize instance
module.exports = {
    sequelize,
    Employee,
    Enquiry
};
