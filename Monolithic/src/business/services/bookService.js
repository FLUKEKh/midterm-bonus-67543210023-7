// src/business/services/bookService.js
const bookRepository = require('../../data/repositories/bookRepository');
const bookValidator = require('../validators/bookValidator');

class BookService {
    async getAllBooks(status = null) {
        // 1. ถ้ามี status ให้ validate
        // 2. เรียก bookRepository.findAll(status)
        // 3. คำนวณสถิติ (available, borrowed, total)
        // 4. return { books, statistics }
        const books = await bookRepository.findAll(status);
        
        const statistics = {
            total: books.length,
            available: books.filter(b => b.status === 'available').length,
            borrowed: books.filter(b => b.status === 'borrowed').length
        };
        
        return { books, statistics };
    }

    async getBookById(id) {
        // 1. Validate ID
        // 2. เรียก repository
        // 3. ถ้าไม่เจอ throw NotFoundError
        // 4. return book
        const validId = bookValidator.validateId(id);
        const book = await bookRepository.findById(validId);
        
        if (!book) {
            throw new Error('Book not found');
        }
        
        return book;
    }

    async createBook(bookData) {
        // 1. Validate book data
        // 2. Validate ISBN format
        // 3. เรียก repository.create()
        // 4. return created book
        bookValidator.validateBookData(bookData);
        bookValidator.validateISBN(bookData.isbn);
        
        const createdBook = await bookRepository.create(bookData);
        return createdBook;
    }

    async updateBook(id, bookData) {
        // ให้นักศึกษาเขียนเอง
        const validId = bookValidator.validateId(id);
        
        // Validate book exists
        const book = await bookRepository.findById(validId);
        if (!book) {
            throw new Error('Book not found');
        }
        
        // Validate ISBN if provided
        if (bookData.isbn) {
            bookValidator.validateISBN(bookData.isbn);
        }
        
        const updatedBook = await bookRepository.update(validId, bookData);
        return updatedBook;
    }

    async borrowBook(id) {
        // 1. ดึงหนังสือจาก repository
        // 2. ตรวจสอบว่า status = 'available' หรือไม่
        // 3. ถ้า borrowed อยู่แล้ว throw error
        // 4. เรียก repository.updateStatus(id, 'borrowed')
        // 5. return updated book
        const validId = bookValidator.validateId(id);
        const book = await bookRepository.findById(validId);
        
        if (!book) {
            throw new Error('Book not found');
        }
        
        if (book.status === 'borrowed') {
            throw new Error('Book is already borrowed');
        }
        
        const updatedBook = await bookRepository.updateStatus(validId, 'borrowed');
        return updatedBook;
    }

    async returnBook(id) {
        const validId = bookValidator.validateId(id);
        const book = await bookRepository.findById(validId);
        
        if (!book) {
            throw new Error('Book not found');
        }
        
        if (book.status === 'available') {
            throw new Error('Book is already available');
        }
        
        const updatedBook = await bookRepository.updateStatus(validId, 'available');
        return updatedBook;
    }

    async deleteBook(id) {
        const validId = bookValidator.validateId(id);
        const book = await bookRepository.findById(validId);
        
        if (!book) {
            throw new Error('Book not found');
        }
        
        if (book.status === 'borrowed') {
            throw new Error('Cannot delete a borrowed book');
        }
        
        const result = await bookRepository.delete(validId);
        return result;
    }
}

module.exports = new BookService();