# 📚 Library Management System - Monolithic Architecture

## 📋 Project Information
- **Student Name:** [นายวรรธนะ คำมาลัย]
- **Student ID:** [67543210023-7]
- **Course:** ENGSE207 Software Architecture

## 🏗️ Architecture Overview

### What is Monolithic Architecture?
A single unified application where all components (presentation, business logic, and data access) are packaged together and run as one process.

**Our 3-Layer Model:**
```
┌──────────────────────────────────────┐
│   PRESENTATION LAYER (HTTP/API)      │
│  Routes → Controllers → Responses    │
├──────────────────────────────────────┤
│   BUSINESS LOGIC LAYER (Core Logic)  │
│  Services → Validators → Rules       │
├──────────────────────────────────────┤
│   DATA ACCESS LAYER (Database)       │
│  Repositories → Queries → SQLite     │
└──────────────────────────────────────┘
```

## 📂 Project Structure
```
MONOLITHIC UI/
├── server.js                          # Entry point
├── package.json                       # Dependencies
├── library.db                         # SQLite database
├── .gitignore                         # Git ignore
├── README.md                          # This file
├── ARCHITECTURE.md                    # Detailed architecture
├── public/                            # Frontend
│   ├── index.html                     # Main UI
│   ├── css/style.css                  # Styles
│   └── js/app.js                      # Frontend logic
└── src/                               # Backend
    ├── presentation/
    │   ├── routes/bookRoutes.js       # API routes
    │   ├── controllers/bookController.js
    │   └── middlewares/errorHandler.js
    ├── business/
    │   ├── services/bookService.js    # Business logic
    │   └── validators/bookValidator.js
    └── data/
        ├── repositories/bookRepository.js
        └── database/connection.js
```

## 🎯 Features

✅ **CRUD Operations** - Create, Read, Update, Delete books
✅ **Borrow/Return** - Manage book lending
✅ **Status Tracking** - Available / Borrowed status
✅ **Statistics** - Total, Available, Borrowed counts
✅ **Data Validation** - Input validation at business layer
✅ **Error Handling** - Centralized error middleware
✅ **Responsive UI** - Works on desktop and mobile
✅ **SQLite Database** - Lightweight and easy to set up

## 🚀 How to Run

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation & Startup
```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start

# 3. Open in browser
http://localhost:3000

# Server runs on port 3000
# Database: library.db (auto-created)
```

## 📝 API Endpoints

### Get Books
```bash
# Get all books
GET /api/books

# Get available books
GET /api/books?status=available

# Get borrowed books
GET /api/books?status=borrowed

# Get specific book
GET /api/books/:id
```

### Create Book
```bash
POST /api/books
Content-Type: application/json

{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "9780132350884"
}
```

### Update Book
```bash
PUT /api/books/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "author": "Updated Author",
  "isbn": "new-isbn"
}
```

### Borrow Book
```bash
PATCH /api/books/:id/borrow
```

### Return Book
```bash
PATCH /api/books/:id/return
```

### Delete Book
```bash
DELETE /api/books/:id
```

## 🧪 Testing with cURL

```bash
# Get all books
curl http://localhost:3000/api/books

# Create a book
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Book","author":"Test Author","isbn":"1234567890"}'

# Borrow a book (ID 1)
curl -X PATCH http://localhost:3000/api/books/1/borrow

# Return a book
curl -X PATCH http://localhost:3000/api/books/1/return

# Update a book
curl -X PUT http://localhost:3000/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"New Title"}'

# Delete a book
curl -X DELETE http://localhost:3000/api/books/1
```

## 📊 Response Format

### Success Response
```json
{
  "id": 1,
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "9780132350884",
  "status": "available",
  "created_at": "2024-01-12T10:30:00Z"
}
```

### Error Response
```json
{
  "error": "Error message describing the issue"
}
```

### Statistics Response
```json
{
  "books": [...],
  "statistics": {
    "total": 10,
    "available": 7,
    "borrowed": 3
  }
}
```

## 🔧 Technology Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite3
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Architecture:** Monolithic (3-Layer)

## 🎓 Architecture Layers Explained

### Presentation Layer
- Handles HTTP requests/responses
- Routes and controllers manage API endpoints
- Error middleware catches all errors
- **Files:** bookRoutes.js, bookController.js, errorHandler.js

### Business Logic Layer
- Implements business rules
- Validates input data
- Manages book operations
- Enforces constraints (e.g., can't delete borrowed books)
- **Files:** bookService.js, bookValidator.js

### Data Access Layer
- Handles all database operations
- Executes SQL queries
- Provides data abstraction
- **Files:** bookRepository.js, connection.js

## ✨ Best Practices Implemented

1. **Separation of Concerns** - Each layer has specific responsibility
2. **Error Handling** - Centralized error middleware
3. **Validation** - Input validation before processing
4. **Repository Pattern** - Abstraction for data access
5. **Async/Await** - Modern Promise handling
6. **Try-Catch** - Proper error handling in controllers

## 📚 Database Schema

```sql
CREATE TABLE books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'available',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Status Values:**
- `available` - Ready to borrow
- `borrowed` - Currently borrowed

## 🐛 Error Handling

| Status Code | Meaning | Example |
|-------------|---------|---------|
| 201 | Created | Book added successfully |
| 400 | Bad Request | Invalid input data |
| 404 | Not Found | Book doesn't exist |
| 409 | Conflict | ISBN already exists |
| 500 | Server Error | Database error |

## 🎯 How It Works

### Create Book Flow
```
1. User fills form and clicks "Save"
2. Frontend sends POST request to /api/books
3. bookController.createBook() receives request
4. bookService.createBook() validates data
5. bookRepository.create() inserts into database
6. Response sent back to frontend
7. UI updates with new book
```

### Borrow Book Flow
```
1. User clicks "Borrow" button
2. Frontend sends PATCH to /api/books/:id/borrow
3. Service checks if book is available
4. If available: status updated to 'borrowed'
5. If borrowed: returns error
6. UI updates with new status
```

## 📖 For More Details
See **ARCHITECTURE.md** for detailed architecture explanation and design patterns.

## 👨‍💻 Created By
ENGSE207 - Software Architecture (Sec 1)

## 📄 License
MIT
