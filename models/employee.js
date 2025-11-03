// models/employee.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Employee = sequelize.define('Employee', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Name cannot be empty'
                },
                len: {
                    args: [2, 100],
                    msg: 'Name must be between 2 and 100 characters'
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: 'Email address already exists'
            },
            validate: {
                isEmail: {
                    msg: 'Must be a valid email address'
                },
                notEmpty: {
                    msg: 'Email cannot be empty'
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Password cannot be empty'
                },
                len: {
                    args: [6, 255],
                    msg: 'Password must be at least 6 characters'
                }
            }
        }
    }, {
        tableName: 'employees',
        timestamps: true, // Adds createdAt and updatedAt
        indexes: [
            {
                unique: true,
                fields: ['email']
            }
        ]
    });

    return Employee;
};
