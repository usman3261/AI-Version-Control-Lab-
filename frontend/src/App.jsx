// App.jsx
// This is the main routing file
// React Router reads the URL and shows the correct page

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BookList from './pages/BookList';
import AddBook from './pages/AddBook';
import EditBook from './pages/EditBook';
import './App.css';

// Helper: Check if a user is logged in
// We store user info in localStorage after login
const isLoggedIn = () => {
  return localStorage.getItem('user') !== null;
};

// Helper: Check if logged-in user is admin
const isAdmin = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.role === 'admin';
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes — anyone can visit */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes — only logged-in users */}
        <Route
          path="/dashboard"
          element={isLoggedIn() ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/books"
          element={isLoggedIn() ? <BookList /> : <Navigate to="/login" />}
        />

        {/* Admin-only Routes */}
        <Route
          path="/add-book"
          element={isAdmin() ? <AddBook /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/edit-book/:id"
          element={isAdmin() ? <EditBook /> : <Navigate to="/dashboard" />}
        />

        {/* Default: redirect to login */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;