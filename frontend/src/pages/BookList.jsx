// pages/BookList.jsx
// Shows all books in the library
// Users can search books by title, author, or genre
// Admins can edit or delete books from here

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

function BookList() {
  // ── State ────────────────────────────────────────────
  const [books, setBooks]         = useState([]);  // all books
  const [filtered, setFiltered]   = useState([]);  // search results
  const [search, setSearch]       = useState('');  // search input
  const [loading, setLoading]     = useState(true);
  const [message, setMessage]     = useState('');  // success/error msg

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // ── Fetch All Books on Load ──────────────────────────
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/books');
      setBooks(response.data);
      setFiltered(response.data); // show all by default
    } catch (error) {
      console.error('Fetch books error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ── Search Handler ───────────────────────────────────
  // Runs every time the search input changes
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearch(query);

    if (query.trim() === '') {
      // If search is empty, show all books
      setFiltered(books);
    } else {
      // Filter books locally (no extra API call needed)
      const results = books.filter(
        (book) =>
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.author.toLowerCase().includes(query.toLowerCase()) ||
          book.genre.toLowerCase().includes(query.toLowerCase())
      );
      setFiltered(results);
    }
  };

  // ── Delete Book Handler (Admin only) ─────────────────
  const handleDelete = async (id, title) => {
    // Ask for confirmation before deleting
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/books/${id}`);

      // Remove deleted book from both lists without re-fetching
      const updated = books.filter((b) => b.id !== id);
      setBooks(updated);
      setFiltered(updated.filter(
        (book) =>
          book.title.toLowerCase().includes(search.toLowerCase()) ||
          book.author.toLowerCase().includes(search.toLowerCase()) ||
          book.genre.toLowerCase().includes(search.toLowerCase())
      ));

      setMessage(`"${title}" deleted successfully.`);
      setTimeout(() => setMessage(''), 3000); // clear after 3s

    } catch (error) {
      console.error('Delete error:', error);
      setMessage('Error deleting book. Try again.');
    }
  };

  // ── JSX ──────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>

        {/* Page Header */}
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>📖 Book Library</h1>
            <p style={styles.pageSubtitle}>
              {filtered.length} book{filtered.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Add Book button for admin */}
          {user.role === 'admin' && (
            <button
              className="btn-primary"
              style={{ width: 'auto', padding: '10px 20px' }}
              onClick={() => navigate('/add-book')}
            >
              ➕ Add New Book
            </button>
          )}
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={
            message.includes('Error') ? 'alert-error' : 'alert-success'
          }>
            {message}
          </div>
        )}

        {/* Search Bar */}
        <div style={styles.searchWrapper}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by title, author, or genre..."
            value={search}
            onChange={handleSearch}
            style={styles.searchInput}
          />
          {/* Clear button appears when there is text */}
          {search && (
            <button
              onClick={() => { setSearch(''); setFiltered(books); }}
              style={styles.clearBtn}
            >
              ✕
            </button>
          )}
        </div>

        {/* Books Table */}
        {loading ? (
          <div style={styles.loadingBox}>
            <p>Loading books...</p>
          </div>

        ) : filtered.length === 0 ? (
          <div style={styles.emptyBox}>
            <p style={styles.emptyIcon}>📭</p>
            <p style={styles.emptyText}>
              {search ? `No books found for "${search}"` : 'No books in library yet.'}
            </p>
            {search && (
              <button
                className="btn-primary"
                style={{ width: 'auto', marginTop: '12px' }}
                onClick={() => { setSearch(''); setFiltered(books); }}
              >
                Clear Search
              </button>
            )}
          </div>

        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHead}>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Author</th>
                  <th style={styles.th}>Genre</th>
                  <th style={styles.th}>Copies</th>
                  {/* Only show Actions column to admin */}
                  {user.role === 'admin' && (
                    <th style={styles.th}>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((book, index) => (
                  <tr
                    key={book.id}
                    style={{
                      ...styles.tableRow,
                      backgroundColor: index % 2 === 0 ? 'white' : '#f7fafc',
                    }}
                  >
                    <td style={styles.td}>{index + 1}</td>
                    <td style={{ ...styles.td, ...styles.titleCell }}>
                      📗 {book.title}
                    </td>
                    <td style={styles.td}>{book.author}</td>
                    <td style={styles.td}>
                      <span style={styles.genreTag}>{book.genre}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.qtyBadge}>{book.quantity}</span>
                    </td>

                    {/* Admin action buttons */}
                    {user.role === 'admin' && (
                      <td style={styles.td}>
                        <div style={styles.actionBtns}>
                          <button
                            className="btn-success"
                            onClick={() => navigate(`/edit-book/${book.id}`)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn-danger"
                            onClick={() => handleDelete(book.id, book.title)}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────
const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '30px 20px',
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  pageTitle: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#2d3748',
  },
  pageSubtitle: {
    color: '#718096',
    fontSize: '14px',
    marginTop: '4px',
  },
  searchWrapper: {
    position: 'relative',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    fontSize: '18px',
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px 12px 44px',
    fontSize: '15px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    outline: 'none',
    backgroundColor: 'white',
    transition: 'border 0.2s',
  },
  clearBtn: {
    position: 'absolute',
    right: '14px',
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    color: '#a0aec0',
  },
  loadingBox: {
    textAlign: 'center',
    padding: '60px',
    color: '#718096',
    backgroundColor: 'white',
    borderRadius: '10px',
  },
  emptyBox: {
    textAlign: 'center',
    padding: '60px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '12px',
  },
  emptyText: {
    color: '#718096',
    fontSize: '16px',
  },
  tableWrapper: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHead: {
    backgroundColor: '#2c7be5',
  },
  th: {
    padding: '14px 16px',
    color: 'white',
    fontWeight: '600',
    fontSize: '14px',
    textAlign: 'left',
  },
  tableRow: {
    borderBottom: '1px solid #e2e8f0',
    transition: 'background 0.15s',
  },
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#4a5568',
    verticalAlign: 'middle',
  },
  titleCell: {
    fontWeight: '600',
    color: '#2d3748',
  },
  genreTag: {
    backgroundColor: '#ebf8ff',
    color: '#2b6cb0',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  qtyBadge: {
    backgroundColor: '#f0fff4',
    color: '#276749',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '700',
    border: '1px solid #c6f6d5',
  },
  actionBtns: {
    display: 'flex',
    gap: '8px',
  },
};

export default BookList;