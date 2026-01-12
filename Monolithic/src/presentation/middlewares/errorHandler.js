// src/presentation/middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
    console.error('Error:', err.message);
    
    // - ValidationError → 400
    // - NotFoundError → 404
    // - ConflictError → 409
    // - Default → 500
    
    let statusCode = 500;
    let errorMessage = err.message || 'Internal server error';
    
    // Check for specific error types
    if (err.message && err.message.includes('Invalid') || err.message.includes('required')) {
        statusCode = 400; // Bad Request
    } else if (err.message && err.message.includes('not found')) {
        statusCode = 404; // Not Found
    } else if (err.message && err.message.includes('already')) {
        statusCode = 409; // Conflict
    } else if (err.code === 'SQLITE_CONSTRAINT') {
        statusCode = 409; // Conflict for database constraints
        errorMessage = 'Conflict: ISBN already exists';
    }
    
    res.status(statusCode).json({
        error: errorMessage
    });
}

module.exports = errorHandler;