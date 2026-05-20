// pages/Login.jsx
// This is the Login page
// It sends email + password to the backend
// If correct, saves user info and redirects to dashboard

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
  // ── State Variables ──────────────────────────────────
  // These store what the user types in the form
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');    // error message
  const [loading, setLoading]   = useState(false); // button loading state

  const navigate = useNavigate(); // used to redirect after login

  // ── Handle Form Submit ───────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault(); // stop page from refreshing

    setError('');     // clear previous errors
    setLoading(true); // show loading on button

    try {
      // Send POST request to our backend
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password }
      );

      // Save user info to localStorage
      // This keeps user "logged in" across page refreshes
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirect to dashboard
      navigate('/dashboard');

    } catch (err) {
      // Show error message from backend
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
    } finally {
      setLoading(false); // stop loading
    }
  };

  // ── JSX (the visual part) ────────────────────────────
  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.logo}>📚</h1>
          <h2 style={styles.title}>Library System</h2>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>

        {/* Error Message */}
        {error && <div className="alert-error">{error}</div>}

        {/* Login Form */}
        <form onSubmit={handleLogin}>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        {/* Link to Register */}
        <p style={styles.registerLink}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>
            Register here
          </Link>
        </p>

        {/* Test credentials hint */}
        <div style={styles.hint}>
          <strong>Test Admin:</strong> admin@library.com / admin123
        </div>

      </div>
    </div>
  );
}

// ── Inline Styles ──────────────────────────────────────
const styles = {
  pageWrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4f8',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '420px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  logo: {
    fontSize: '48px',
    marginBottom: '8px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#2d3748',
  },
  subtitle: {
    color: '#718096',
    fontSize: '14px',
    marginTop: '4px',
  },
  registerLink: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '14px',
    color: '#555',
  },
  link: {
    color: '#2c7be5',
    textDecoration: 'none',
    fontWeight: '600',
  },
  hint: {
    marginTop: '16px',
    padding: '10px',
    backgroundColor: '#ebf8ff',
    borderRadius: '6px',
    fontSize: '13px',
    color: '#2b6cb0',
    textAlign: 'center',
  },
};

export default Login;