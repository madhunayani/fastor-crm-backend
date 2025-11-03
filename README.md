# 🚀 Fastor CRM Backend API

![Node.js](https://img.shields.io/badge/Node.js-v18+-green?logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-Latest-blue)
![SQLite](https://img.shields.io/badge/SQLite-3-lightblue)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange)
![License](https://img.shields.io/badge/License-MIT-success)
![Tests](https://img.shields.io/badge/Tests-19%2F19%20Passing-brightgreen)

A **secure, scalable, and production-ready REST API** for a Customer Relationship Management (CRM) system with advanced lead management capabilities. Built with Node.js, Express.js, SQLite, and JWT authentication.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [API Endpoints](#-api-endpoints)
- [Authentication](#-authentication)
- [Usage Examples](#-usage-examples)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Security Features](#-security-features)
- [Database Schema](#-database-schema)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Functionality
✅ **Employee Management** - Register and login for counselors/employees  
✅ **Lead Capture** - Public enquiry submission without authentication  
✅ **Lead Management** - Claim and manage leads with public/private visibility  
✅ **Smart Conflict Detection** - Prevent duplicate lead claims (409 Conflict)  
✅ **Multi-Counselor Support** - Data isolation between counselors  

### Security & Performance
✅ **JWT Authentication** - Secure token-based authentication (1-hour expiry)  
✅ **Password Hashing** - Bcrypt with 10 salt rounds  
✅ **Input Validation** - Comprehensive validation on all endpoints  
✅ **Error Handling** - Proper HTTP status codes and error messages  
✅ **Protected Routes** - Middleware-based authorization  

### Developer Experience
✅ **Comprehensive Testing** - 19 automated tests (100% passing)  
✅ **Full Documentation** - API docs with examples  
✅ **Clean Code Structure** - MVC pattern organization  
✅ **Production Ready** - Best practices implemented  

---

## 🛠 Tech Stack

| Component | Technology |
|-----------|-----------|
| **Runtime** | Node.js (v18+) |
| **Framework** | Express.js |
| **Database** | SQLite 3 |
| **ORM** | Sequelize |
| **Authentication** | JWT (jsonwebtoken) |
| **Password Security** | bcrypt |
| **Environment** | dotenv |
| **Dev Tools** | nodemon |

---

## 📦 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **SQLite3** (optional, for CLI management)
- **Git** (for version control)
- **Postman** (optional, for API testing)

**Verify Installation:**
node --version
npm --version


---

## 🚀 Installation

### Step 1: Clone the Repository

git clone https://github.com/madhurayani/fastor-crm-backend.git
cd fastor-crm-backend


### Step 2: Install Dependencies
npm install


### Step 3: Configure Environment

Create a `.env` file in the root directory:
touch .env


Add this content:

Server Configuration
PORT=3000

JWT Secret (Use a strong, random string in production)
JWT_SECRET=your_super_secure_jwt_secret_key_change_this_in_production_123456789

Database Configuration
DB_DIALECT=sqlite
DB_STORAGE=./crm_database.sqlite


### Step 4: Verify Installation
npm run dev


**Expected Output:**
✅ Database connection established successfully.
✅ All models synchronized with database.
🚀 Server is running on http://localhost:3000


---

## 🎯 Quick Start

### Start the Server

Development mode (with auto-restart on file changes)
npm run dev

Production mode
npm start


### Test an Endpoint

Register a new employee
curl -X POST http://localhost:3000/api/employees/register
-H "Content-Type: application/json"
-d '{
"name": "John Doe",
"email": "john@example.com",
"password": "SecurePassword123"
}'


---

## 📚 API Endpoints

### Authentication Endpoints

#### Register Employee
POST /api/employees/register
Content-Type: application/json

{
"name": "John Doe",
"email": "john@example.com",
"password": "SecurePassword123"
}


**Response (201 Created):**
{
"message": "Employee registered successfully",
"employee": {
"id": 1,
"name": "John Doe",
"email": "john@example.com",
"createdAt": "2025-11-04T..."
},
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}


---

#### Login Employee
POST /api/employees/login
Content-Type: application/json

{
"email": "john@example.com",
"password": "SecurePassword123"
}


**Response (200 OK):**
{
"message": "Login successful",
"employee": {
"id": 1,
"name": "John Doe",
"email": "john@example.com"
},
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}



---

### Enquiry Endpoints

#### Submit Public Enquiry (Public)
POST /api/enquiries/public
Content-Type: application/json

{
"name": "Alice Johnson",
"email": "alice@example.com",
"courseInterest": "Web Development"
}


**Response (201 Created):**
{
"message": "Enquiry submitted successfully",
"enquiry": {
"id": 1,
"name": "Alice Johnson",
"email": "alice@example.com",
"courseInterest": "Web Development",
"claimed": false,
"counselorId": null,
"createdAt": "2025-11-04T..."
}
}


---

#### Get Public Enquiries (Protected)
GET /api/enquiries/public
Authorization: Bearer <JWT_TOKEN>


**Response (200 OK):**
{
"message": "Public enquiries retrieved successfully",
"count": 3,
"enquiries": [
{
"id": 1,
"name": "Alice Johnson",
"email": "alice@example.com",
"courseInterest": "Web Development",
"claimed": false,
"counselorId": null
}
]
}


---

#### Get Private Enquiries (Protected)
GET /api/enquiries/private
Authorization: Bearer <JWT_TOKEN>

**Response (200 OK):**

{
"message": "Private enquiries retrieved successfully",
"count": 1,
"enquiries": [
{
"id": 1,
"name": "Alice Johnson",
"claimed": true,
"counselorId": 1,
"counselor": {
"id": 1,
"name": "John Doe",
"email": "john@example.com"
}
}
]
}


---

#### Claim Enquiry (Protected)
PATCH /api/enquiries/1/claim
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json


**Response (200 OK):**
{
"message": "Lead claimed successfully",
"enquiry": {
"id": 1,
"name": "Alice Johnson",
"claimed": true,
"counselorId": 1
}
}


**Error Response (409 Conflict - Already Claimed):**
{
"message": "This lead has already been claimed by another counselor",
"enquiry": {
"id": 1,
"claimed": true,
"claimedBy": 2
}
}


---

## 🔐 Authentication

### How JWT Works

1. **Get Token** → Login or Register
2. **Use Token** → Add to Authorization header as `Bearer <TOKEN>`
3. **Token Expires** → After 1 hour (refresh by logging in again)

### Using JWT in Requests

Example with curl
curl -X GET http://localhost:3000/api/enquiries/public
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

Example with Postman
Authorization Tab → Type: Bearer Token → Token: <your-jwt>

### Token Structure

JWT Format: <header>.<payload>.<signature>

Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjMwNTI5NzY1fQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c


---

## 💡 Usage Examples

### Complete Workflow Example

1. Register an employee
REGISTER=$(curl -s -X POST http://localhost:3000/api/employees/register
-H "Content-Type: application/json"
-d '{
"name": "Jane Smith",
"email": "jane@example.com",
"password": "Password123"
}')

TOKEN=$(echo $REGISTER | jq -r '.token')
echo "Token: $TOKEN"

2. Submit a public enquiry (no auth needed)
curl -X POST http://localhost:3000/api/enquiries/public
-H "Content-Type: application/json"
-d '{
"name": "Student Name",
"email": "student@example.com",
"courseInterest": "Full Stack Development"
}'

3. Get all public enquiries (requires auth)
curl -X GET http://localhost:3000/api/enquiries/public
-H "Authorization: Bearer $TOKEN"

4. Claim an enquiry
curl -X PATCH http://localhost:3000/api/enquiries/1/claim
-H "Authorization: Bearer $TOKEN"
-H "Content-Type: application/json"

5. Get your private enquiries
curl -X GET http://localhost:3000/api/enquiries/private
-H "Authorization: Bearer $TOKEN"



---

## 🧪 Testing

### Run Automated Tests

Make script executable
chmod +x API_TESTS.sh

Run all 19 tests
./API_TESTS.sh


**Expected Output:**

==================================
FASTOR CRM API - TEST SUITE
[TEST 1] Root Endpoint
✅ PASSED: Root endpoint returns success message

[TEST 2] Employee Registration
✅ PASSED: Register employee 1
✅ PASSED: Register employee 2
...

==================================
TEST SUMMARY
Passed: 19
Failed: 0
Total: 19
🎉 ALL TESTS PASSED! 🎉


### Test with Postman

1. **Import Collection:**
   - Open Postman
   - Click Import
   - Select `Fastor_CRM_Collection.json`

2. **Set Environment:**
   - Select `Fastor Local` environment
   - Update `jwt_token` with a real token from Login

3. **Run Collection:**
   - Click the blue "Run" button
   - Watch all endpoints execute

---

## 📁 Project Structure

fastor-crm-backend/
│
├── config/
│ └── database.js # Database configuration & connection
│
├── controllers/
│ ├── employeeController.js # Employee authentication logic
│ └── enquiryController.js # Lead management logic
│
├── middlewares/
│ └── auth.js # JWT verification middleware
│
├── models/
│ ├── index.js # Model initialization & relationships
│ ├── employee.js # Employee schema definition
│ └── enquiry.js # Enquiry/Lead schema definition
│
├── routes/
│ ├── employeeRoutes.js # Authentication endpoints
│ └── enquiryRoutes.js # Lead management endpoints
│
├── server.js # Main Express application
├── package.json # Project dependencies
├── .env # Environment configuration
├── .gitignore # Git ignore rules
├── API_TESTS.sh # 19 automated tests
│
└── Documentation Files:
├── README.md # This file
├── API_DOCUMENTATION.md # Complete API reference
├── TESTING_DOCUMENTATION.md # Testing guide
└── ASSIGNMENT_COMPLETION_REPORT.md



---

## 🔒 Security Features

### Password Security
- ✅ Hashed with **bcrypt** (10 salt rounds)
- ✅ Never stored in plaintext
- ✅ Securely compared on login

### JWT Authentication
- ✅ **HS256 algorithm** with strong secret
- ✅ **1-hour expiration** for security
- ✅ **Bearer token** validation on protected routes
- ✅ **401 Unauthorized** on invalid/missing token

### Data Validation
- ✅ Email format validation
- ✅ Required field checking
- ✅ Input sanitization

### Database Security
- ✅ **SQL Injection Prevention** (Sequelize ORM)
- ✅ **Foreign Key Constraints**
- ✅ **Unique Constraints** (email)
- ✅ **Proper Indexing**

---

## 📊 Database Schema

### Employees Table
CREATE TABLE employees (
id INTEGER PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(100) NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL (hashed),
createdAt TIMESTAMP,
updatedAt TIMESTAMP
);


### Enquiries Table
CREATE TABLE enquiries (
id INTEGER PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(100) NOT NULL,
email VARCHAR(100) NOT NULL,
courseInterest VARCHAR(255) NOT NULL,
claimed BOOLEAN DEFAULT false,
counselorId INTEGER FOREIGN KEY (references employees.id),
createdAt TIMESTAMP,
updatedAt TIMESTAMP
);


### Relationships
- **One-to-Many**: One Employee → Many Enquiries
- **Cascade Rules**: Update CASCADE, Delete SET NULL

---

## 🐛 Troubleshooting

### Issue: `Port 3000 already in use`
Kill the process using port 3000
Linux/Mac:
lsof -i :3000
kill -9 <PID>

Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F


### Issue: `Database locked`
Delete the old database
rm crm_database.sqlite

Restart the server
npm run dev


### Issue: `JWT token expired`
Token expires after 1 hour
Simply login again to get a new token
curl -X POST http://localhost:3000/api/employees/login
-H "Content-Type: application/json"
-d '{"email":"user@example.com","password":"password"}'


### Issue: `401 Unauthorized on protected routes`
Check if you're sending the token correctly
Format: Authorization: Bearer <TOKEN>
Verify the token is not expired (1 hour max)
Get a new token by logging in again


---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

---

## 📝 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## 👨‍💻 Author

**Madhu Nayani**
- GitHub: [@madhurayani](https://github.com/madhurayani)
- Project: [Fastor CRM Backend](https://github.com/madhurayani/fastor-crm-backend)

---

## 📞 Support

For issues, questions, or suggestions:
1. **Open an Issue** on GitHub
2. **Check Documentation** in `/docs` folder
3. **Review** API_DOCUMENTATION.md for endpoint details

---

## 🎯 Roadmap

- [ ] Add email notifications for new enquiries
- [ ] Implement enquiry search & filtering
- [ ] Add role-based access control (RBAC)
- [ ] Create admin dashboard endpoints
- [ ] Add rate limiting
- [ ] Implement logging system
- [ ] Add Docker support
- [ ] Create frontend application

---

## ⭐ Show Your Support

If this project helped you, please give it a ⭐ on GitHub!

Made with ❤️ by Madhu Nayani

