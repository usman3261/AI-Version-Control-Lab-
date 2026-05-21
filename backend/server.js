// server.js
// This is the main entry point of our backend
// It starts the server and connects all the route files

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import route files
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');

// Create the express app
const app = express();

// ─── MIDDLEWARE ───────────────────────────────────────────
// Middleware runs on every request before reaching routes

// cors: allows React (port 5173) to talk to this server (port 5000)
app.use(cors({
  origin: 'http://localhost:5173', // React app address
  credentials: true
}));

// express.json(): allows server to read JSON data sent from frontend
app.use(express.json());

// ─── ROUTES ───────────────────────────────────────────────
// Connect route files to URL paths

app.use('/api/auth', authRoutes);   // Login & Register → /api/auth/...
app.use('/api/books', bookRoutes);  // Book CRUD       → /api/books/...

// ─── TEST ROUTE ───────────────────────────────────────────
// Visit http://localhost:5000 to confirm server is running
app.get('/', (req, res) => {
  res.json({ message: 'Library Management System API is running!' });
});

// ─── START SERVER ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});