// routes/books.js
// Handles all Book CRUD operations:
// C - Create (Add book)
// R - Read   (Get all books, Get one book)
// U - Update (Edit book)
// D - Delete (Remove book)

const express = require('express');
const router = express.Router();
const db = require('../db');

// ─────────────────────────────────────────────────────────
// ROUTE 1: GET ALL BOOKS
// URL: GET /api/books
// What it does: Returns all books from database
// ─────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const [books] = await db.query('SELECT * FROM books ORDER BY added_at DESC');
    res.json(books);
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Error fetching books' });
  }
});

// ─────────────────────────────────────────────────────────
// ROUTE 2: SEARCH BOOKS
// URL: GET /api/books/search?query=clean
// What it does: Returns books matching search term
// ─────────────────────────────────────────────────────────
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    // SQL LIKE lets us do partial matching
    // '%clean%' matches "Clean Code", "Cleaning House", etc.
    const [books] = await db.query(
      'SELECT * FROM books WHERE title LIKE ? OR author LIKE ? OR genre LIKE ?',
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );

    res.json(books);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Error searching books' });
  }
});

// ─────────────────────────────────────────────────────────
// ROUTE 3: GET ONE BOOK BY ID
// URL: GET /api/books/:id
// What it does: Returns a single book (used for edit form)
// ─────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get id from URL

    const [books] = await db.query(
      'SELECT * FROM books WHERE id = ?', 
      [id]
    );

    if (books.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(books[0]);
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ message: 'Error fetching book' });
  }
});

// ─────────────────────────────────────────────────────────
// ROUTE 4: ADD A BOOK
// URL: POST /api/books
// What it does: Inserts a new book into the database
// ─────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { title, author, genre, quantity } = req.body;

    // Validate required fields
    if (!title || !author) {
      return res.status(400).json({ message: 'Title and author are required' });
    }

    await db.query(
      'INSERT INTO books (title, author, genre, quantity) VALUES (?, ?, ?, ?)',
      [title, author, genre || 'General', quantity || 1]
    );

    res.status(201).json({ message: 'Book added successfully!' });
  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).json({ message: 'Error adding book' });
  }
});

// ─────────────────────────────────────────────────────────
// ROUTE 5: UPDATE A BOOK
// URL: PUT /api/books/:id
// What it does: Updates an existing book's information
// ─────────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, genre, quantity } = req.body;

    await db.query(
      'UPDATE books SET title = ?, author = ?, genre = ?, quantity = ? WHERE id = ?',
      [title, author, genre, quantity, id]
    );

    res.json({ message: 'Book updated successfully!' });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ message: 'Error updating book' });
  }
});

// ─────────────────────────────────────────────────────────
// ROUTE 6: DELETE A BOOK
// URL: DELETE /api/books/:id
// What it does: Removes a book from the database
// ─────────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await db.query('DELETE FROM books WHERE id = ?', [id]);

    res.json({ message: 'Book deleted successfully!' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Error deleting book' });
  }
});

module.exports = router;