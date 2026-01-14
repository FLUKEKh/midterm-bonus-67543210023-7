// backend/src/presentation/middlewares/cors.js
function corsMiddleware(req, res, next) {
    // Allow requests from any origin
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Allow specific HTTP methods
    res.setHeader('Access-Control-Allow-Methods', 
        'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    
    // Allow specific headers
    res.setHeader('Access-Control-Allow-Headers', 
        'Content-Type, Authorization');
    
    // Handle preflight requests (OPTIONS)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    next();
}

module.exports = corsMiddleware;