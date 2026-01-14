// backend/server.js
const express = require('express');
const bookRoutes = require('./src/presentation/routes/bookRoutes');
const corsMiddleware = require('./src/presentation/middlewares/cors');
const errorHandler = require('./src/presentation/middlewares/errorHandler');

const app = express();

// 🆕 CORS must come FIRST
app.use(corsMiddleware);
app.use(express.json());

// Routes
app.use('/api/books', bookRoutes);

// Error handling (must be LAST)
app.use(errorHandler);

// 🆕 Listen on 0.0.0.0 (สำคัญสำหรับ VM)
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔═══════════════════════════════════════════════╗
║  Library API Server (Client-Server)          ║
║  Server running on http://0.0.0.0:${PORT}     ║
║  API Endpoints: http://localhost:${PORT}/api  ║
╚═══════════════════════════════════════════════╝
    `);
});