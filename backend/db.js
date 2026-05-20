// db.js
// This file handles the MySQL database connection
// Think of this as the "bridge" between our server and database

const mysql = require('mysql2');
require('dotenv').config(); // Load variables from .env file

// Create a connection pool
// A pool manages multiple connections efficiently
const pool = mysql.createPool({
  host: process.env.DB_HOST,         // usually 'localhost'
  user: process.env.DB_USER,         // usually 'root'
  password: process.env.DB_PASSWORD, // your MySQL password
  database: process.env.DB_NAME,     // library_db
  waitForConnections: true,
  connectionLimit: 10,               // max 10 connections at once
});

// Export the pool so other files can use it
module.exports = pool.promise(); // .promise() lets us use async/await