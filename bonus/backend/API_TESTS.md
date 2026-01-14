# API Tests - Library Management

## Base URL
\`\`\`
http://localhost:3000/api
\`\`\`

## Endpoints

### 1. Get All Books
\`\`\`bash
curl http://localhost:3000/api/books
\`\`\`

**Expected:**
\`\`\`json
{
  "books": [...],
  "statistics": {
    "available": 0,
    "borrowed": 0,
    "total": 0
  }
}
\`\`\`

### 2. Create Book
\`\`\`bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "isbn": "9780132350884"
  }'
\`\`\`

### 3. Borrow Book
\`\`\`bash
curl -X PATCH http://localhost:3000/api/books/1/borrow
\`\`\`

### 4. Return Book
\`\`\`bash
curl -X PATCH http://localhost:3000/api/books/1/return
\`\`\`

### 5. Delete Book
\`\`\`bash
curl -X DELETE http://localhost:3000/api/books/1
\`\`\`