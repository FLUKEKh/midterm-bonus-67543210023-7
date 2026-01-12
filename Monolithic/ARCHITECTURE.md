# 🏗️ Library Management System - Architecture Guide

## 📊 C1: System Context Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                        End User                                │
│                     (Library Staff)                            │
│                                                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    REST API (HTTP)
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│           Library Management System (Node.js/Express)          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         Layered Architecture Application               │   │
│  │  - Presentation Layer                                  │   │
│  │  - Business Logic Layer                                │   │
│  │  - Data Access Layer                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                    SQLite Operations
                           │
                           ▼
                    ┌──────────────┐
                    │  SQLite DB   │
                    │ (library.db) │
                    └──────────────┘
```

### System Components:
- **User**: Library staff using the system via REST API
- **Application**: Node.js/Express server with Layered Architecture
- **Database**: SQLite database storing book information

---

## 📦 C2: Container Diagram - Layered Architecture

```
╔═════════════════════════════════════════════════════════════════════════╗
║                     CLIENT REQUEST (HTTP)                              ║
╚════════════════════════════════════╦═════════════════════════════════════╝
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                     🎯 PRESENTATION LAYER                               │
│                     (Request / Response Handling)                       │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ bookRoutes.js                                                   │   │
│  │ ├── GET /api/books                → getAllBooks()              │   │
│  │ ├── GET /api/books/:id            → getBookById()              │   │
│  │ ├── POST /api/books               → createBook()               │   │
│  │ ├── PUT /api/books/:id            → updateBook()               │   │
│  │ ├── PATCH /api/books/:id/borrow   → borrowBook()               │   │
│  │ ├── PATCH /api/books/:id/return   → returnBook()               │   │
│  │ └── DELETE /api/books/:id         → deleteBook()               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ bookController.js                                               │   │
│  │ ├── Extract request parameters (req.params, req.query)         │   │
│  │ ├── Call Business Layer (bookService)                          │   │
│  │ ├── Format response (JSON)                                     │   │
│  │ └── Call error handler (next(error))                           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ errorHandler.js                                                 │   │
│  │ ├── Catch errors from all layers                               │   │
│  │ ├── Determine HTTP status code                                 │   │
│  │ │   - ValidationError → 400                                    │   │
│  │ │   - NotFoundError → 404                                      │   │
│  │ │   - ConflictError → 409                                      │   │
│  │ │   - Server Error → 500                                       │   │
│  │ └── Send error response                                        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└──────────────────────────────────────────┬───────────────────────────────┘
                                           │
                                           ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                    💼 BUSINESS LOGIC LAYER                              │
│                    (Business Rules & Validation)                        │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ bookService.js (Core Business Logic)                            │   │
│  │                                                                 │   │
│  │ getAllBooks(status)                                            │   │
│  │ ├── Call bookRepository.findAll()                              │   │
│  │ ├── Calculate statistics (total, available, borrowed)          │   │
│  │ └── Return {books, statistics}                                 │   │
│  │                                                                 │   │
│  │ getBookById(id)                                                │   │
│  │ ├── Validate ID                                                │   │
│  │ ├── Call bookRepository.findById()                             │   │
│  │ ├── Throw error if not found                                   │   │
│  │ └── Return book                                                │   │
│  │                                                                 │   │
│  │ createBook(bookData)                                           │   │
│  │ ├── Validate book data                                         │   │
│  │ ├── Validate ISBN format                                       │   │
│  │ ├── Call bookRepository.create()                               │   │
│  │ └── Return created book                                        │   │
│  │                                                                 │   │
│  │ borrowBook(id)                                                 │   │
│  │ ├── Get book from repository                                   │   │
│  │ ├── Check if already borrowed                                  │   │
│  │ ├── Throw error if borrowed                                    │   │
│  │ ├── Call bookRepository.updateStatus('borrowed')               │   │
│  │ └── Return updated book                                        │   │
│  │                                                                 │   │
│  │ returnBook(id)                                                 │   │
│  │ ├── Get book from repository                                   │   │
│  │ ├── Check if available                                         │   │
│  │ ├── Throw error if available                                   │   │
│  │ ├── Call bookRepository.updateStatus('available')              │   │
│  │ └── Return updated book                                        │   │
│  │                                                                 │   │
│  │ deleteBook(id)                                                 │   │
│  │ ├── Get book from repository                                   │   │
│  │ ├── Check if borrowed                                          │   │
│  │ ├── Throw error if borrowed                                    │   │
│  │ ├── Call bookRepository.delete()                               │   │
│  │ └── Return success message                                     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ bookValidator.js (Input Validation)                             │   │
│  │                                                                 │   │
│  │ validateBookData(data)                                         │   │
│  │ ├── Check if title exists                                      │   │
│  │ ├── Check if author exists                                     │   │
│  │ ├── Check if isbn exists                                       │   │
│  │ └── Throw error if validation fails                            │   │
│  │                                                                 │   │
│  │ validateISBN(isbn)                                             │   │
│  │ ├── Check ISBN pattern: (978|979)?\d{9}[\dXx]$                │   │
│  │ ├── Remove hyphens                                             │   │
│  │ └── Throw error if invalid format                              │   │
│  │                                                                 │   │
│  │ validateId(id)                                                 │   │
│  │ ├── Parse as integer                                           │   │
│  │ ├── Check if positive number                                   │   │
│  │ └── Throw error if invalid                                     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└──────────────────────────────────────────┬───────────────────────────────┘
                                           │
                                           ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                    🗄️ DATA ACCESS LAYER                                  │
│                    (Database Operations)                                │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ bookRepository.js (CRUD Operations)                             │   │
│  │                                                                 │   │
│  │ findAll(status)                                                │   │
│  │ ├── Build SQL: SELECT * FROM books [WHERE status = ?]         │   │
│  │ ├── Execute query                                              │   │
│  │ └── Return array of books                                      │   │
│  │                                                                 │   │
│  │ findById(id)                                                   │   │
│  │ ├── Build SQL: SELECT * FROM books WHERE id = ?               │   │
│  │ ├── Execute query                                              │   │
│  │ └── Return single book or null                                 │   │
│  │                                                                 │   │
│  │ create(bookData)                                               │   │
│  │ ├── Build SQL: INSERT INTO books (title, author, isbn) ...    │   │
│  │ ├── Execute insert                                             │   │
│  │ ├── Get lastID                                                 │   │
│  │ └── Return created book                                        │   │
│  │                                                                 │   │
│  │ update(id, bookData)                                           │   │
│  │ ├── Build UPDATE SQL dynamically                               │   │
│  │ ├── Only update provided fields                                │   │
│  │ ├── Execute update                                             │   │
│  │ └── Return updated book                                        │   │
│  │                                                                 │   │
│  │ updateStatus(id, status)                                       │   │
│  │ ├── Build SQL: UPDATE books SET status = ? WHERE id = ?       │   │
│  │ ├── Execute update                                             │   │
│  │ └── Return updated book                                        │   │
│  │                                                                 │   │
│  │ delete(id)                                                     │   │
│  │ ├── Build SQL: DELETE FROM books WHERE id = ?                 │   │
│  │ ├── Execute delete                                             │   │
│  │ └── Return success message                                     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ connection.js (Database Connection)                             │   │
│  │                                                                 │   │
│  │ ├── Create SQLite3 database instance                           │   │
│  │ ├── Initialize database (create tables if not exist)           │   │
│  │ │   - Table: books                                            │   │
│  │ │     - id: INTEGER PRIMARY KEY AUTOINCREMENT                 │   │
│  │ │     - title: TEXT NOT NULL                                  │   │
│  │ │     - author: TEXT NOT NULL                                 │   │
│  │ │     - isbn: TEXT UNIQUE NOT NULL                            │   │
│  │ │     - status: TEXT DEFAULT 'available'                      │   │
│  │ │     - created_at: DATETIME DEFAULT CURRENT_TIMESTAMP        │   │
│  │ └── Export database instance                                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└──────────────────────────────────────────┬───────────────────────────────┘
                                           │
                                           ▼
                              ┌─────────────────────────┐
                              │    🗄️ SQLite Database   │
                              │                         │
                              │  books table            │
                              │  ├── id                 │
                              │  ├── title              │
                              │  ├── author             │
                              │  ├── isbn               │
                              │  ├── status             │
                              │  └── created_at         │
                              └─────────────────────────┘
```

---

## 🎯 Layer Responsibilities

### 1️⃣ Presentation Layer
**File Path**: `src/presentation/`

**Responsibility**: Handle HTTP requests and responses

| Component | Role |
|-----------|------|
| **Routes** | Define API endpoints and map them to controllers |
| **Controllers** | Extract data from requests, call services, format responses |
| **Error Handler** | Catch errors and return appropriate HTTP status codes |

**Key Functions**:
- ✅ Parse incoming requests (query params, body, URL params)
- ✅ Call business logic services
- ✅ Format and return JSON responses
- ✅ Handle HTTP status codes
- ✅ Catch and process errors

**Example Request Flow**:
```javascript
GET /api/books?status=available
  ↓
bookRoutes.js → matches route
  ↓
bookController.getAllBooks(req, res, next)
  ├── Extract status from req.query
  ├── Call bookService.getAllBooks(status)
  ├── res.json({books, statistics})
  └── Error? → next(error)
```

---

### 2️⃣ Business Logic Layer
**File Path**: `src/business/`

**Responsibility**: Implement business rules and validate data

| Component | Role |
|-----------|------|
| **Services** | Implement core business logic and workflows |
| **Validators** | Validate input data according to business rules |

**Key Functions**:
- ✅ Check business rules (e.g., can't borrow already borrowed book)
- ✅ Validate input data (ISBN format, required fields)
- ✅ Orchestrate operations across repositories
- ✅ Calculate derived data (statistics)
- ✅ Throw meaningful errors

**Example Business Logic**:
```javascript
async borrowBook(id) {
  // 1. Get book from database
  const book = await bookRepository.findById(id);
  
  // 2. Check business rule
  if (book.status === 'borrowed') {
    throw new Error('Book is already borrowed');
  }
  
  // 3. Update status
  return await bookRepository.updateStatus(id, 'borrowed');
}
```

---

### 3️⃣ Data Access Layer
**File Path**: `src/data/`

**Responsibility**: Handle all database operations

| Component | Role |
|-----------|------|
| **Repositories** | Execute database queries (CRUD operations) |
| **Connection** | Manage database connection and initialization |

**Key Functions**:
- ✅ Execute SQL queries
- ✅ Handle database errors
- ✅ Return query results
- ✅ Provide data persistence
- ✅ Abstract database details from business logic

**Example Database Operation**:
```javascript
async findById(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);  // Return single book
    });
  });
}
```

---

## 📊 Data Flow Examples

### Example 1: Create a New Book

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER (HTTP Client)                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ POST /api/books
                         │ {title: "Clean Code", author: "...", isbn: "..."}
                         ▼
        ┌─────────────────────────────────────────┐
        │  bookRoutes (Presentation Layer)        │
        │  Routes request to controller           │
        └─────────────────────┬───────────────────┘
                              │
                              │ Call controller
                              ▼
        ┌─────────────────────────────────────────┐
        │  bookController.createBook()            │
        │  Extract req.body                       │
        │  Call bookService.createBook()          │
        └─────────────────────┬───────────────────┘
                              │
                              │ Pass data to service
                              ▼
        ┌─────────────────────────────────────────┐
        │  bookService.createBook()               │
        │  (Business Logic Layer)                 │
        │                                         │
        │  1. bookValidator.validateBookData()    │
        │  2. bookValidator.validateISBN()        │
        │  3. bookRepository.create(bookData)     │
        │  4. Return created book                 │
        └─────────────────────┬───────────────────┘
                              │
                              │ Call repository
                              ▼
        ┌─────────────────────────────────────────┐
        │  bookRepository.create()                │
        │  (Data Access Layer)                    │
        │                                         │
        │  INSERT INTO books (...)                │
        │  VALUES (?, ?, ?)                       │
        │                                         │
        │  SELECT * FROM books WHERE id = ?       │
        │  Return {id, title, author, ...}        │
        └─────────────────────┬───────────────────┘
                              │
                              │ Execute SQL
                              ▼
                    ┌──────────────────┐
                    │   SQLite DB      │
                    │                  │
                    │  INSERT INTO ... │
                    │  SELECT * FROM   │
                    └──────────────────┘
                              │
                              │ Return new book
                              ▼
        ┌─────────────────────────────────────────┐
        │  bookService returns book               │
        │  {id: 1, title, author, isbn, status}   │
        └─────────────────────┬───────────────────┘
                              │
                              │ Format response
                              ▼
        ┌─────────────────────────────────────────┐
        │  bookController                         │
        │  res.status(201).json(book)             │
        └─────────────────────┬───────────────────┘
                              │
                              │ HTTP 201 Created
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    USER (Response)                              │
│         {id: 1, title, author, isbn, status: "available"}      │
└─────────────────────────────────────────────────────────────────┘
```

### Example 2: Borrow a Book

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER (HTTP Client)                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ PATCH /api/books/1/borrow
                         ▼
        ┌─────────────────────────────────────────┐
        │  bookController.borrowBook()            │
        │  Extract id from req.params             │
        │  Call bookService.borrowBook()          │
        └─────────────────────┬───────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  bookService.borrowBook()               │
        │  (Business Logic Layer)                 │
        │                                         │
        │  ✅ Validate ID                         │
        │  ✅ Get book from repository            │
        │  ✅ Check if available                  │
        │     ├─ If borrowed: throw error         │
        │     └─ If available: proceed            │
        │  ✅ Update status to 'borrowed'         │
        │  ✅ Return updated book                 │
        └─────────────────────┬───────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  bookRepository.updateStatus()          │
        │  UPDATE books SET status = 'borrowed'   │
        │  WHERE id = 1                           │
        └─────────────────────┬───────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   SQLite DB      │
                    │   UPDATE books   │
                    └──────────────────┘
                              │
                              │ Return updated book
                              ▼
        ┌─────────────────────────────────────────┐
        │  bookController returns response        │
        │  res.json({..., status: 'borrowed'})    │
        └─────────────────────┬───────────────────┘
                              │
                              │ HTTP 200 OK
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    USER (Response)                              │
│           {..., status: "borrowed"}                             │
└─────────────────────────────────────────────────────────────────┘
```

### Example 3: Error Handling (Invalid ISBN)

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER (HTTP Client)                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ POST /api/books
                         │ {isbn: "INVALID"}
                         ▼
        ┌─────────────────────────────────────────┐
        │  bookController.createBook()            │
        │  Call bookService.createBook()          │
        └─────────────────────┬───────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  bookService.createBook()               │
        │                                         │
        │  bookValidator.validateISBN()           │
        │  ❌ ISBN doesn't match pattern          │
        │  throw new Error("Invalid ISBN format") │
        └─────────────────────┬───────────────────┘
                              │
                              │ Error thrown
                              ▼
        ┌─────────────────────────────────────────┐
        │  bookController                         │
        │  next(error)                            │
        └─────────────────────┬───────────────────┘
                              │
                              │ Error forwarded
                              ▼
        ┌─────────────────────────────────────────┐
        │  errorHandler middleware                │
        │                                         │
        │  Check error message:                   │
        │  "Invalid ISBN format"                  │
        │  → status = 400 (Bad Request)           │
        │                                         │
        │  res.status(400).json({error: "..."})   │
        └─────────────────────┬───────────────────┘
                              │
                              │ HTTP 400 Bad Request
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    USER (Error Response)                        │
│         {error: "Invalid ISBN format"}                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Interaction Between Layers

```
┌────────────────────────────────────────────────────────────┐
│            COMMUNICATION BETWEEN LAYERS                    │
└────────────────────────────────────────────────────────────┘

Presentation → Business Logic
  ├── Pass: user input data
  ├── Call: bookService methods
  ├── Expect: result or error
  └── Receive: processed data

Business Logic → Data Access
  ├── Pass: data to persist/retrieve
  ├── Call: bookRepository methods
  ├── Expect: database results or error
  └── Receive: raw data from database

Business Logic → Business Logic (internal)
  ├── Validation → Services
  ├── Services validate data before using repository
  ├── Services orchestrate multiple repository calls
  └── Services combine results

Error Flow (upward)
  ├── Data Access → throws database error
  ├── Business Logic → catches and wraps error
  ├── Presentation → catches and formats error
  └── User → receives HTTP error response
```

---

## 🎓 Benefits of Layered Architecture

### ✅ Separation of Concerns
- Each layer has a single, well-defined responsibility
- Easy to understand what each part does
- Changes in one layer don't affect others

### ✅ Testability
```javascript
// Easy to test Controller with mocked Service
const mockService = {
  getAllBooks: jest.fn().mockResolvedValue({books: [], statistics: {}})
};

// Easy to test Service with mocked Repository
const mockRepository = {
  findAll: jest.fn().mockResolvedValue([])
};

// Easy to test Repository with real or mocked Database
```

### ✅ Reusability
- Business Logic can be reused with different interfaces (REST, GraphQL, CLI)
- Repository methods can be reused in different services
- Validators can be reused across different entities

### ✅ Maintainability
- Bug in HTTP handling? Look in Presentation Layer
- Bug in business logic? Look in Business Logic Layer
- Bug in database? Look in Data Access Layer

### ✅ Scalability
- Add new features without affecting existing code
- Scale layers independently (database, business logic, API)
- Easy to add authentication, caching, logging to specific layers

---

## 🏁 Summary

The **Layered Architecture** organizes the system into three independent layers:

1. **Presentation Layer**: HTTP handling, routing, request/response formatting
2. **Business Logic Layer**: Business rules, validation, orchestration
3. **Data Access Layer**: Database operations, queries, persistence

**Data flows downward** (Presentation → Business → Data) for creating/reading/updating data.

**Errors flow upward** to be caught and handled appropriately.

This structure makes the system **modular, testable, maintainable, and scalable**.

---

**Created**: January 12, 2026
**Architecture Pattern**: Layered (N-tier)
**Framework**: Express.js + Node.js
**Database**: SQLite3
