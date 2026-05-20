// routes/auth.js
// Handles user REGISTRATION and LOGIN
// These are the two auth operations we need

const express = require('express');
const router = express.Router();
const db = require('../db');         // Import database connection
const bcrypt = require('bcryptjs');  // For password hashing

// ─────────────────────────────────────────────────────────
// ROUTE 1: REGISTER
// URL: POST /api/auth/register
// What it does: Creates a new user in the database
// ─────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    // Step 1: Get data sent from the frontend form
    const { name, email, password } = req.body;

    // Step 2: Validate - make sure nothing is empty
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Step 3: Check if this email is already registered
    const [existingUser] = await db.query(
      'SELECT * FROM users WHERE email = ?', 
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Step 4: Hash the password before saving
    // bcrypt turns "mypassword" into "$2a$10$xyz..." 
    // so even if database is hacked, passwords are safe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 5: Insert new user into database
    await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    // Step 6: Send success response
    res.status(201).json({ message: 'Registration successful!' });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// ─────────────────────────────────────────────────────────
// ROUTE 2: LOGIN
// URL: POST /api/auth/login
// What it does: Checks credentials and returns user info
// ─────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    // Step 1: Get email and password from frontend
    const { email, password } = req.body;

    // Step 2: Validate fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Step 3: Find user in database by email
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?', 
      [email]
    );

    // Step 4: If no user found, return error
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = users[0];

    // Step 5: Compare entered password with hashed password in DB
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Step 6: Send user info back to frontend (never send password!)
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;