# 📚 Library Management System - Monolithic Architecture

## Overview
A simple library management system built with **Monolithic Architecture** using Express.js, SQLite, and vanilla JavaScript.

## Features
- ✅ CRUD operations (Create, Read, Update, Delete) for books
- ✅ Borrow and return functionality
- ✅ Book status tracking (available/borrowed)
- ✅ Statistics dashboard (total, available, borrowed books)
- ✅ Responsive web UI
- ✅ Input validation and error handling
- ✅ SQLite database

## Project Structure
```
MONOLITHIC UI/
├── server.js                    # Entry point
├── package.json                 # Dependencies
├── library.db                   # SQLite database (auto-generated)
├── public/                      # Frontend files
│   ├── index.html              # Main HTML
│   ├── css/
│   │   └── style.css           # Styles
│   └── js/
│       └── app.js              # Frontend logic
└── src/                        # Backend code
    ├── presentation/           # UI Layer
    │   ├── routes/
    │   │   └── bookRoutes.js
    │   ├── controllers/
    │   │   └── bookController.js
    │   └── middlewares/
    │       └── errorHandler.js
    ├── business/               # Business Logic Layer
    │   ├── services/
    │   │   └── bookService.js
    │   └── validators/
    │       └── bookValidator.js
    └── data/                   # Data Access Layer
        ├── repositories/
        │   └── bookRepository.js
        └── database/
            └── connection.js
```

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Server
```bash
npm start
```

Server will run on: **http://localhost:3000**

## API Endpoints

### Books
- `GET /api/books` - Get all books
- `GET /api/books?status=available` - Get available books
- `GET /api/books?status=borrowed` - Get borrowed books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book
- `PATCH /api/books/:id/borrow` - Borrow book
- `PATCH /api/books/:id/return` - Return book

### Request/Response Format

#### Create Book
```json
POST /api/books
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "9780132350884"
}

Response:
{
  "id": 1,
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "9780132350884",
  "status": "available",
  "created_at": "2024-01-12T10:30:00Z"
}
```

#### Borrow/Return Book
```json
PATCH /api/books/1/borrow
Response: { id: 1, ..., status: "borrowed" }

PATCH /api/books/1/return
Response: { id: 1, ..., status: "available" }
```

## Testing with cURL

```bash
# Get all books
curl http://localhost:3000/api/books

# Create a book
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Book","author":"Author","isbn":"1234567890"}'

# Borrow a book
curl -X PATCH http://localhost:3000/api/books/1/borrow

# Return a book
curl -X PATCH http://localhost:3000/api/books/1/return

# Update a book
curl -X PUT http://localhost:3000/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title"}'

# Delete a book
curl -X DELETE http://localhost:3000/api/books/1
```

## Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Architecture**: Monolithic (3-layer architecture)

## Error Handling
- 400 Bad Request - Invalid input data
- 404 Not Found - Resource not found
- 409 Conflict - ISBN already exists or invalid status transition
- 500 Internal Server Error - Server error

## Architecture Layers

### Presentation Layer (`/src/presentation`)
- Handles HTTP requests/responses
- Routes incoming requests to controllers
- Error handling middleware

### Business Logic Layer (`/src/business`)
- Contains core business rules
- Services for book operations
- Validators for data validation

### Data Access Layer (`/src/data`)
- Database connection
- Repository pattern for data operations
- SQL query execution

## Created by
นักศึกษา ENGSE207 - Software Architecture

## License
MIT
