// components/Navbar.jsx
// This is the top navigation bar shown on all pages after login
// It shows the app name, navigation links, and logout button

import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  // Get logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // ── Logout Handler ───────────────────────────────────
  const handleLogout = () => {
    // Remove user from localStorage
    localStorage.removeItem('user');
    // Redirect to login page
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>

      {/* Left side: App name */}
      <div style={styles.brand}>
        <span style={styles.logo}>📚</span>
        <span style={styles.brandName}>Library System</span>
      </div>

      {/* Middle: Navigation Links */}
      <div style={styles.navLinks}>
        <Link to="/dashboard" style={styles.link}>
          🏠 Dashboard
        </Link>
        <Link to="/books" style={styles.link}>
          📖 Books
        </Link>

        {/* Only show these links to admin users */}
        {user.role === 'admin' && (
          <Link to="/add-book" style={styles.link}>
            ➕ Add Book
          </Link>
        )}
      </div>

      {/* Right side: User info + Logout */}
      <div style={styles.userSection}>
        <span style={styles.userName}>
          👤 {user.name}
          {user.role === 'admin' && (
            <span style={styles.adminBadge}>Admin</span>
          )}
        </span>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

    </nav>
  );
}

// ── Styles ─────────────────────────────────────────────
const styles = {
  navbar: {
    backgroundColor: '#2c7be5',
    padding: '0 24px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logo: {
    fontSize: '24px',
  },
  brandName: {
    color: 'white',
    fontWeight: '700',
    fontSize: '18px',
  },
  navLinks: {
    display: 'flex',
    gap: '24px',
  },
  link: {
    color: 'rgba(255,255,255,0.9)',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '500',
    padding: '6px 10px',
    borderRadius: '6px',
    transition: 'background 0.2s',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  userName: {
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  adminBadge: {
    backgroundColor: '#f6ad55',
    color: '#744210',
    fontSize: '11px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '12px',
  },
  logoutBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.4)',
    padding: '6px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background 0.2s',
  },
};

export default Navbar;