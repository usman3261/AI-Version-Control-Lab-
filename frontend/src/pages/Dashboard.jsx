// pages/Dashboard.jsx
// This is the first page users see after login
// It shows a welcome message and quick statistics

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

function Dashboard() {
  // ── State ────────────────────────────────────────────
  const [stats, setStats]   = useState({
    totalBooks: 0,
    totalCopies: 0,
  });
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading]         = useState(true);

  const navigate = useNavigate();

  // Get logged-in user
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // ── Fetch Data on Page Load ──────────────────────────
  // useEffect runs once when the component first appears
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all books from backend
      const response = await axios.get('http://localhost:5000/api/books');
      const books = response.data;

      // Calculate stats from the books data
      const totalCopies = books.reduce(
        (sum, book) => sum + book.quantity, 0
      );

      setStats({
        totalBooks: books.length,
        totalCopies: totalCopies,
      });

      // Show only the 3 most recently added books
      setRecentBooks(books.slice(0, 3));

    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ── JSX ──────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>

        {/* Welcome Banner */}
        <div style={styles.welcomeBanner}>
          <div>
            <h1 style={styles.welcomeTitle}>
              Welcome back, {user.name}! 👋
            </h1>
            <p style={styles.welcomeSubtitle}>
              {user.role === 'admin'
                ? 'You have admin access. Manage books below.'
                : 'Browse and search books in the library.'}
            </p>
          </div>
          <span style={styles.welcomeEmoji}>📚</span>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <p style={styles.loading}>Loading statistics...</p>
        ) : (
          <div style={styles.statsGrid}>

            <div style={{ ...styles.statCard, borderTop: '4px solid #2c7be5' }}>
              <div style={styles.statNumber}>{stats.totalBooks}</div>
              <div style={styles.statLabel}>📚 Total Books</div>
            </div>

            <div style={{ ...styles.statCard, borderTop: '4px solid #38a169' }}>
              <div style={styles.statNumber}>{stats.totalCopies}</div>
              <div style={styles.statLabel}>📦 Total Copies</div>
            </div>

            <div style={{ ...styles.statCard, borderTop: '4px solid #d69e2e' }}>
              <div style={styles.statNumber}>
                {user.role === 'admin' ? '🔑' : '👤'}
              </div>
              <div style={styles.statLabel}>
                {user.role === 'admin' ? 'Admin Account' : 'User Account'}
              </div>
            </div>

          </div>
        )}

        {/* Quick Action Buttons — Admin Only */}
        {user.role === 'admin' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Quick Actions</h2>
            <div style={styles.actionGrid}>

              <Link to="/add-book" style={styles.actionCard}>
                <span style={styles.actionIcon}>➕</span>
                <span style={styles.actionLabel}>Add New Book</span>
              </Link>

              <Link to="/books" style={styles.actionCard}>
                <span style={styles.actionIcon}>📖</span>
                <span style={styles.actionLabel}>Manage Books</span>
              </Link>

            </div>
          </div>
        )}

        {/* Recently Added Books */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Recently Added Books</h2>
            <Link to="/books" style={styles.viewAllLink}>
              View All →
            </Link>
          </div>

          {recentBooks.length === 0 ? (
            <p style={styles.emptyMsg}>No books in the library yet.</p>
          ) : (
            <div style={styles.recentGrid}>
              {recentBooks.map((book) => (
                <div key={book.id} style={styles.recentCard}>
                  <div style={styles.bookIcon}>📗</div>
                  <div style={styles.bookInfo}>
                    <div style={styles.bookTitle}>{book.title}</div>
                    <div style={styles.bookAuthor}>by {book.author}</div>
                    <div style={styles.bookGenre}>{book.genre}</div>
                  </div>
                  <div style={styles.bookQty}>
                    {book.quantity} copies
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '30px 20px',
  },
  welcomeBanner: {
    backgroundColor: '#2c7be5',
    borderRadius: '12px',
    padding: '28px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
  },
  welcomeTitle: {
    color: 'white',
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '6px',
  },
  welcomeSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: '15px',
  },
  welcomeEmoji: {
    fontSize: '56px',
  },
  loading: {
    textAlign: 'center',
    color: '#718096',
    padding: '20px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '28px',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '24px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '6px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#718096',
    fontWeight: '500',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '16px',
  },
  viewAllLink: {
    color: '#2c7be5',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
  },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  actionCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f7fafc',
    borderRadius: '8px',
    textDecoration: 'none',
    border: '2px dashed #cbd5e0',
    transition: 'all 0.2s',
    gap: '8px',
  },
  actionIcon: {
    fontSize: '28px',
  },
  actionLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4a5568',
  },
  recentGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  recentCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '14px',
    backgroundColor: '#f7fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  bookIcon: {
    fontSize: '32px',
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontWeight: '700',
    fontSize: '15px',
    color: '#2d3748',
  },
  bookAuthor: {
    fontSize: '13px',
    color: '#718096',
    marginTop: '2px',
  },
  bookGenre: {
    fontSize: '12px',
    color: '#a0aec0',
    marginTop: '2px',
  },
  bookQty: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#38a169',
    backgroundColor: '#f0fff4',
    padding: '4px 10px',
    borderRadius: '12px',
    border: '1px solid #c6f6d5',
  },
  emptyMsg: {
    color: '#a0aec0',
    textAlign: 'center',
    padding: '20px',
  },
};

export default Dashboard;