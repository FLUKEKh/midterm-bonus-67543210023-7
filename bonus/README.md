# Library Management System - Client-Server Architecture

## Project Information
- **Student Name:** นายวรรธนะ คำมาลัย
- **Student ID:** 67543210023-7
- **Course:** ENGSE207 - Bonus Exam

## Architecture

### Overview
This project demonstrates a modern **Client-Server Architecture** for a Library Management System, separating the presentation layer (Frontend) from the business logic layer (Backend).

### Before: Layered Architecture
- Single monolithic application
- Frontend + Backend tightly coupled
- Limited scalability

### After: Client-Server Architecture
- **Backend:** REST API (Node.js + Express + SQLite)
- **Frontend:** Web Client (HTML + CSS + JavaScript)
- **Communication:** HTTP/JSON protocol
- **Separation of Concerns:** Clear division between client and server

## Project Structure

```
midterm-bonus-67543210023/
├── bonus/
│   ├── ARCHITECTURE.md          # Architecture documentation
│   ├── README.md                # This file
│   ├── backend/                 # REST API Server
│   │   ├── package.json         # Dependencies
│   │   ├── server.js            # Main server file
│   │   ├── src/
│   │   │   ├── presentation/    # Controllers & Routes
│   │   │   │   ├── controllers/
│   │   │   │   ├── middlewares/
│   │   │   │   └── routes/
│   │   │   ├── business/        # Services & Validators
│   │   │   └── data/            # Repositories & Database
│   │   └── API_TESTS.md         # API endpoint documentation
│   └── frontend/                # Web Client
│       ├── index.html           # Main HTML
│       ├── css/
│       │   └── style.css        # Styling
│       └── js/
│           ├── app.js           # Main application logic
│           ├── api.js           # API client
│           └── components/      # Modular components
```

## How to Run

### Prerequisites
- Node.js (v14+)
- npm
- Modern web browser
- Internet connection to VM

### Backend (Server - VM)
```bash
cd backend
npm install
npm start
# Server runs at: http://192.168.56.101:3000
# API base: http://192.168.56.101:3000/api
```

### Frontend (Client - Local)
```bash
cd frontend
# Option 1: Open index.html directly in browser
# Option 2: Use Python HTTP server
python3 -m http.server 8000
# Access: http://localhost:8000
```

## API Endpoints

### Base URL
```
http://192.168.56.101:3000/api
```

### Books Management

#### 1. Get All Books
```bash
GET /api/books
GET /api/books?status=available
GET /api/books?status=borrowed
```
**Response:**
```json
{
  "books": [
    {
      "id": 1,
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "isbn": "9780132350884",
      "status": "available"
    }
  ],
  "statistics": {
    "available": 5,
    "borrowed": 2,
    "total": 7
  }
}
```

#### 2. Get Book by ID
```bash
GET /api/books/:id
```

#### 3. Create Book
```bash
POST /api/books
Content-Type: application/json

{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "9780132350884"
}
```

#### 4. Update Book
```bash
PUT /api/books/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "author": "Updated Author",
  "isbn": "9780132350884"
}
```

#### 5. Borrow Book
```bash
PATCH /api/books/:id/borrow
```

#### 6. Return Book
```bash
PATCH /api/books/:id/return
```

#### 7. Delete Book
```bash
DELETE /api/books/:id
```

## Features

✅ **Frontend Features:**
- View all books with pagination
- Filter books by status (Available/Borrowed)
- Add new book
- Edit existing book
- Borrow/Return book
- Delete book
- View book statistics (total, available, borrowed)
- Responsive design
- Loading states

✅ **Backend Features:**
- RESTful API endpoints
- Input validation
- Error handling with proper HTTP status codes
- ISBN validation
- SQLite database
- Modular architecture (Controllers, Services, Repositories)

## Key Components

### Frontend
- **app.js**: Main application logic and event handling
- **api.js**: HTTP client for API communication
- **bookForm.js**: Modal form for create/edit operations
- **bookList.js**: Book list rendering component
- **style.css**: Complete styling with responsive design

### Backend
- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic and validation
- **Repositories**: Database operations
- **Middlewares**: Error handling, CORS
- **Validators**: Input validation

## Error Handling

The application includes comprehensive error handling:
- **400**: Bad Request (invalid input)
- **404**: Not Found (book doesn't exist)
- **409**: Conflict (business logic violation, e.g., deleting borrowed book)
- **500**: Internal Server Error

## Technologies Used

### Backend
- Node.js
- Express.js
- SQLite3
- CORS middleware

### Frontend
- HTML5
- CSS3 (Grid, Flexbox, Animations)
- Vanilla JavaScript (ES6+)
- Fetch API

## Notes

- The server IP is configured to `192.168.56.101` (adjust as needed)
- The database is automatically initialized on first run
- All book data is persisted in SQLite
- The API follows REST principles