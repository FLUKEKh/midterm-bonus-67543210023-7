// src/business/validators/bookValidator.js
class BookValidator {
    validateBookData(data) {
        const { title, author, isbn } = data;
        
        if (!title || !author || !isbn) {
            throw new Error('Title, author, and ISBN are required');
        }
        
        return true;
    }
    
    validateISBN(isbn) {
        // Accept any non-empty string
        if (!isbn || typeof isbn !== 'string' || isbn.trim() === '') {
            throw new Error('ISBN is required');
        }
        return true;
    }
    
    validateId(id) {
        const numId = parseInt(id);
        if (isNaN(numId) || numId <= 0) {
            throw new Error('Invalid book ID');
        }
        return numId;
    }
}

module.exports = new BookValidator();
