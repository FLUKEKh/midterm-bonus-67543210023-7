// src/business/services/bookService.js
const bookRepository = require('../../data/repositories/bookRepository');
const bookValidator = require('../validators/bookValidator');

class BookService {
    async getAllBooks(status = null) {
        const books = await bookRepository.findAll(status);
        
        const statistics = {
            total: books.length,
            available: books.filter(b => b.status === 'available').length,
            borrowed: books.filter(b => b.status === 'borrowed').length
        };
        
        return { books, statistics };
    }

    async getBookById(id) {
        const validId = bookValidator.validateId(id);
        const book = await bookRepository.findById(validId);
        
        if (!book) {
            throw new Error('Book not found');
        }
        
        return book;
    }

    async createBook(bookData) {
        bookValidator.validateBookData(bookData);
        bookValidator.validateISBN(bookData.isbn);
        
        const createdBook = await bookRepository.create(bookData);
        return createdBook;
    }

    async updateBook(id, bookData) {
        const validId = bookValidator.validateId(id);
        
        const book = await bookRepository.findById(validId);
        if (!book) {
            throw new Error('Book not found');
        }
        
        if (bookData.isbn) {
            bookValidator.validateISBN(bookData.isbn);
        }
        
        const updatedBook = await bookRepository.update(validId, bookData);
        return updatedBook;
    }

    async borrowBook(id) {
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
