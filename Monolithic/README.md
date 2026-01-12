# 📚 Library Management System - Layered Architecture

## 📋 Project Information
- **Student Name:** [นายวรรธนะ คำมาลัย]
- **Student ID:** [67543210023-7]
- **Course:** ENGSE207 Software Architecture

## 🏗️ Architecture Style
**Layered Architecture (3-tier Model)**

ระบบแบ่งชั้นเป็น 3 ชั้นหลัก:
1. **Presentation Layer** - การแสดงผลและรับข้อมูลจากผู้ใช้
2. **Business Logic Layer** - ตรรกะทางธุรกิจและการประมวลผลข้อมูล
3. **Data Access Layer** - การจัดการข้อมูลและติดต่อฐานข้อมูล

## 📂 Project Structure

```
library-management/
├── server.js                          # Entry point
├── package.json                       # Dependencies
├── README.md                          # Documentation
├── library.db                         # SQLite Database
│
├── src/
│   ├── presentation/                  # ชั้น Presentation
│   │   ├── controllers/
│   │   │   └── bookController.js      # Handle HTTP requests/responses
│   │   ├── routes/
│   │   │   └── bookRoutes.js          # API route definitions
│   │   └── middlewares/
│   │       └── errorHandler.js        # Global error handler
│   │
│   ├── business/                      # ชั้น Business Logic
│   │   ├── services/
│   │   │   └── bookService.js         # Business logic for books
│   │   └── validators/
│   │       └── bookValidator.js       # Data validation rules
│   │
│   └── data/                          # ชั้น Data Access
│       ├── database/
│       │   └── connection.js          # Database connection & initialization
│       └── repositories/
│           └── bookRepository.js      # Database operations (CRUD)
│
└── public/                            # Static files (optional)
```

## 🎯 Refactoring Summary

### ❌ ปัญหาของ Monolithic (เดิม):
1. **Mixed Concerns** - ตรวจสอบข้อมูล, ตรรกะธุรกิจ, และการจัดการฐานข้อมูลผสมกัน
2. **Hard to Test** - ยากต่อการทดสอบแต่ละส่วน (Unit Testing)
3. **Difficult to Maintain** - การแก้ไขในส่วนหนึ่งอาจส่งผลกระทบทั้งระบบ
4. **Reusability Issues** - ไม่สามารถนำตรรกะธุรกิจไปใช้กับ interface อื่นๆ
5. **Scalability Problems** - ยากต่อการขยายฟีเจอร์หรือเปลี่ยนเทคโนโลยี

### ✅ วิธีแก้ไขด้วย Layered Architecture:

| ปัญหา | วิธีแก้ไข |
|------|---------|
| **Mixed Concerns** | แยก Concern ออกเป็น 3 ชั้นที่เป็นอิสระ |
| **Hard to Test** | แต่ละชั้นสามารถทดสอบได้อย่างเป็นอิสระ |
| **Difficult to Maintain** | การเปลี่ยนแปลงมีการส่งผลกระทบน้อย |
| **Reusability Issues** | Service สามารถนำไปใช้ได้ทั่วไป |
| **Scalability Problems** | ขยายส่วนย่อยได้ง่าย |

### 🎁 ประโยชน์ที่ได้รับ:
1. **Separation of Concerns** - แต่ละชั้นมีความรับผิดชอบเพียงอย่างเดียว
2. **Easier Testing** - สามารถ Unit Test ได้ง่ายขึ้น
3. **Better Maintainability** - เข้าใจและแก้ไขโค้ดได้ง่ายขึ้น
4. **Code Reusability** - Logic สามารถนำไปใช้ซ้ำได้หลายที่
5. **Flexible & Scalable** - เปลี่ยน Database หรือเพิ่มฟีเจอร์ได้ง่าย

## 🚀 How to Run

### Prerequisites
- Node.js (v14 หรือสูงกว่า)
- npm

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Run server
npm start

# 3. Server จะเปิดบน http://localhost:3000
```

### Testing with curl

```bash
# Get all books
curl http://localhost:3000/api/books

# Create new book
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Clean Code","author":"Robert Martin","isbn":"9780136083238"}'

# Borrow book
curl -X PATCH http://localhost:3000/api/books/1/borrow

# Return book
curl -X PATCH http://localhost:3000/api/books/1/return
```

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | ได้รับหนังสือทั้งหมด |
| GET | `/api/books/:id` | ได้รับหนังสือ 1 เล่ม |
| POST | `/api/books` | สร้างหนังสือใหม่ |
| PUT | `/api/books/:id` | อัปเดตหนังสือ |
| PATCH | `/api/books/:id/borrow` | ยืมหนังสือ |
| PATCH | `/api/books/:id/return` | คืนหนังสือ |
| DELETE | `/api/books/:id` | ลบหนังสือ |

## 🔍 Layer Details

### Presentation Layer
- **BookController** - Handle HTTP requests
- **BookRoutes** - Define API endpoints
- **ErrorHandler** - Global error handling

### Business Logic Layer
- **BookService** - Business rules & logic
- **BookValidator** - Data validation

### Data Access Layer
- **BookRepository** - Database operations
- **Connection** - Database setup

## 🔐 Error Handling

| Status | Error Type |
|--------|-----------|
| 400 | ValidationError |
| 404 | NotFoundError |
| 409 | ConflictError |
| 500 | Server Error |

---

**Last Updated:** January 12, 2026
**Status:** ✅ Completed