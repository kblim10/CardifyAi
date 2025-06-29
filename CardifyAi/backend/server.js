const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// File upload directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads folder if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Import routes
const authRoutes = require('./routes/auth');
const deckRoutes = require('./routes/decks');
const cardRoutes = require('./routes/cards');
const ocrRoutes = require('./routes/ocr');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/decks', deckRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/ocr', ocrRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('CardifyAi API is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
console.log('Checking environment variables:');
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('JWT_EXPIRE exists:', !!process.env.JWT_EXPIRE);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('PORT exists:', !!process.env.PORT);
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
