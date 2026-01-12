// src/presentation/controllers/bookController.js
const bookService = require('../../business/services/bookService');

class BookController {
    async getAllBooks(req, res, next) {
        try {
            const { status } = req.query;
            const result = await bookService.getAllBooks(status);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async getBookById(req, res, next) {
        try {
            const { id } = req.params;
            const book = await bookService.getBookById(id);
            res.json(book);
        } catch (error) {
            next(error);
        }
    }

    async createBook(req, res, next) {
        try {
            const createdBook = await bookService.createBook(req.body);
            res.status(201).json(createdBook);
        } catch (error) {
            next(error);
        }
    }

    async updateBook(req, res, next) {
        try {
            const { id } = req.params;
            const updatedBook = await bookService.updateBook(id, req.body);
            res.json(updatedBook);
        } catch (error) {
            next(error);
        }
    }

    async borrowBook(req, res, next) {
        try {
            const { id } = req.params;
            const borrowedBook = await bookService.borrowBook(id);
            res.json(borrowedBook);
        } catch (error) {
            next(error);
        }
    }

    async returnBook(req, res, next) {
        try {
            const { id } = req.params;
            const returnedBook = await bookService.returnBook(id);
            res.json(returnedBook);
        } catch (error) {
            next(error);
        }
    }

    async deleteBook(req, res, next) {
        try {
            const { id } = req.params;
            const result = await bookService.deleteBook(id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new BookController();
