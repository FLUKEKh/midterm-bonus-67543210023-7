# 🏗️ Architecture Documentation - Monolithic Library Management System

## Overview
This document describes the architecture of the **Monolithic Library Management System**, which implements a **3-Layer Monolithic Architecture** pattern.

## Architecture Pattern

### What is Monolithic Architecture?
A monolithic architecture is an architectural style where:
- All components are packaged in a single application
- All layers run in the same process
- Database is shared across all layers
- Single deployment unit

### Our 3-Layer Model
```
┌─────────────────────────────────────────────┐
│     PRESENTATION LAYER (HTTP/API)           │
│  Routes → Controllers → Error Handling      │
├─────────────────────────────────────────────┤
│     BUSINESS LOGIC LAYER (Core Logic)       │
│  Services → Validators → Business Rules     │
├─────────────────────────────────────────────┤
│     DATA ACCESS LAYER (Database)            │
│  Repositories → Database Connection → SQL   │
├─────────────────────────────────────────────┤
│            SQLITE DATABASE                   │
└─────────────────────────────────────────────┘
```

## Layer Details

### 1. Presentation Layer (`src/presentation/`)

**Purpose**: Handle HTTP requests and responses

**Components**:
- **Routes** (`routes/bookRoutes.js`): Define API endpoints
- **Controllers** (`controllers/bookController.js`): Handle request/response logic
- **Middlewares** (`middlewares/errorHandler.js`): Global error handling

**Responsibilities**:
- Parse HTTP requests
- Validate request data format
- Call business layer services
- Format and send responses
- Handle errors gracefully

**Example Flow**:
```
HTTP Request
    ↓
bookRoutes.js (Route handler)
    ↓
bookController.js (Business logic call)
    ↓
HTTP Response
```

### 2. Business Logic Layer (`src/business/`)

**Purpose**: Implement core business rules and validation

**Components**:
- **Services** (`services/bookService.js`): Core business operations
- **Validators** (`validators/bookValidator.js`): Input validation

**Responsibilities**:
- Validate book data (title, author, ISBN)
- Enforce business rules (e.g., can't delete borrowed books)
- Manage book status transitions
- Calculate statistics
- Coordinate between presentation and data layers

**Key Operations**:
```javascript
// Get all books with statistics
getAllBooks(status) → { books[], statistics }

// Create a new book
createBook(data) → validates → repository.create()

// Borrow a book
borrowBook(id) → check status → updateStatus('borrowed')

// Delete a book
deleteBook(id) → check if available → repository.delete()
```

### 3. Data Access Layer (`src/data/`)

**Purpose**: Manage all database operations

**Components**:
- **Repositories** (`repositories/bookRepository.js`): Data access operations
- **Database** (`database/connection.js`): Database connection & initialization

**Responsibilities**:
- Execute SQL queries
- Manage database connections
- Handle database errors
- Provide data abstraction

**CRUD Operations**:
```javascript
findAll(status)     // SELECT * FROM books
findById(id)        // SELECT * FROM books WHERE id = ?
create(data)        // INSERT INTO books
update(id, data)    // UPDATE books SET ...
updateStatus(id)    // UPDATE books SET status = ?
delete(id)          // DELETE FROM books WHERE id = ?
```

## Data Flow Example: Create Book

```
1. PRESENTATION LAYER
   POST /api/books
   ├─ bookRoutes.js receives request
   └─ calls bookController.createBook()

2. CONTROLLER
   ├─ extracts data from req.body
   └─ calls bookService.createBook(data)

3. BUSINESS LOGIC LAYER
   ├─ bookService.createBook()
   ├─ validates book data
   │  └─ bookValidator.validateBookData()
   │  └─ bookValidator.validateISBN()
   └─ calls bookRepository.create(data)

4. DATA ACCESS LAYER
   ├─ bookRepository.create()
   ├─ executes INSERT query
   └─ returns created book

5. RESPONSE
   ├─ Controller formats response
   ├─ Sends JSON response
   └─ Client receives new book data
```

## Design Principles

### 1. Separation of Concerns
Each layer has a specific responsibility:
- Presentation: HTTP handling
- Business: Logic & validation
- Data: Database operations

### 2. Dependency Direction
Dependencies flow from top to bottom:
```
Presentation → Business → Data
```

Controllers never directly call repositories; they go through services.

### 3. Error Handling
```
Try-Catch in Controller
    ↓
Pass error to next(error)
    ↓
Error Handler Middleware
    ↓
Format and send error response
```

### 4. Validation
- Data validation happens in validators
- Business rules checked in services
- Request format checked in controllers

## Database Schema

### Books Table
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

### Status Values
- `available` - Book is available to borrow
- `borrowed` - Book is currently borrowed

## Code Structure Examples

### Service Layer (Business Logic)
```javascript
class BookService {
    async createBook(bookData) {
        // 1. Validate input
        bookValidator.validateBookData(bookData);
        
        // 2. Business rule check
        // ISBN must be unique (checked by DB)
        
        // 3. Call repository
        const createdBook = await bookRepository.create(bookData);
        
        // 4. Return result
        return createdBook;
    }
}
```

### Controller (Request Handler)
```javascript
class BookController {
    async createBook(req, res, next) {
        try {
            const book = await bookService.createBook(req.body);
            res.status(201).json(book);
        } catch (error) {
            next(error); // Pass to error handler
        }
    }
}
```

### Repository (Data Access)
```javascript
class BookRepository {
    async create(bookData) {
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO books (title, author, isbn) VALUES (?, ?, ?)',
                [bookData.title, bookData.author, bookData.isbn],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }
}
```

## Advantages of This Architecture

✅ **Simple**: Easy to understand and implement
✅ **All-in-One**: Single deployment unit
✅ **Development**: Straightforward development process
✅ **Testing**: Easy to test with mocks
✅ **Small Projects**: Perfect for small to medium applications

## Limitations

⚠️ Difficult to scale individual components
⚠️ Technology stack is tightly coupled
⚠️ Complex features can become hard to manage
⚠️ Not ideal for microservices

## Best Practices Used

1. **Error Handling**: Centralized error middleware
2. **Validation**: Input validation before business logic
3. **Repository Pattern**: Abstraction for data access
4. **Async/Await**: Modern Promise handling
5. **Separation of Concerns**: Clear layer boundaries
6. **Single Responsibility**: Each class has one job

## Future Improvements

- Add authentication & authorization
- Implement logging system
- Add database migrations
- Unit and integration tests
- API documentation (Swagger)
- Caching layer
- Input sanitization (XSS protection)

---

**Created for**: ENGSE207 - Software Architecture
**Date**: January 2026
**Version**: 1.0
