// models/enquiry.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Enquiry = sequelize.define('Enquiry', {
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
            validate: {
                isEmail: {
                    msg: 'Must be a valid email address'
                },
                notEmpty: {
                    msg: 'Email cannot be empty'
                }
            }
        },
        courseInterest: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'course_interest', // Database column name
            validate: {
                notEmpty: {
                    msg: 'Course interest cannot be empty'
                }
            }
        },
        claimed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        counselorId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
            field: 'counselor_id', // Database column name
            references: {
                model: 'employees',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        }
    }, {
        tableName: 'enquiries',
        timestamps: true,
        indexes: [
            {
                fields: ['claimed']
            },
            {
                // FIX: Use the actual database column name 'counselor_id' instead of 'counselorId'
                fields: ['counselor_id']
            }
        ]
    });

    return Enquiry;
};
