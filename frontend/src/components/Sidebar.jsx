import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import BooksPage from './pages/BooksPage';
import MembersPage from './pages/MembersPage';
import IssuesPage from './pages/IssuesPage';
import FinesPage from './pages/FinesPage';
import PaymentsPage from './pages/PaymentsPage';
import ReportsPage from './pages/ReportsPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';
import './index.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : {
      name: 'Library Owner',
      email: 'owner@library.com',
      role: 'Administrator',
    };
  });
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchDashboard = async () => {
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/dashboard', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          setDashboardData(data.data);
        } catch (error) {
          console.error('Failed to fetch dashboard:', error);
          setDashboardData({
            totalBooks: 1248,
            availableBooks: 876,
            issuedBooks: 192,
            overdueBooks: 12,
            totalMembers: 356,
            activeMembers: 298,
            totalStaff: 18,
            todaysIssues: 34,
            todaysReturns: 29,
            collectedFine: 8400,
            pendingFines: 3200,
            monthlyRevenue: 84200,
            reservedBooks: 48,
            netCollection: 67000,
          });
        }
      }
      setLoading(false);
    };
    fetchDashboard();
  }, [token]);

  const handleLoginSuccess = (newToken, userData) => {
    setToken(newToken);
    const safeUser = userData || {
      name: 'Library Owner',
      email: 'owner@library.com',
      role: 'Administrator',
    };
    setUser(safeUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(safeUser));
  };

  const handleLogout = () => {
    setToken(null);
    setUser({
      name: 'Library Owner',
      email: 'owner@library.com',
      role: 'Administrator',
    });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="text-white text-6xl"
        >
          📚
        </motion.div>
      </div>
    );
  }

  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <BrowserRouter>
      <Layout user={user} onLogout={handleLogout}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route
              path="/"
              element={
                <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Dashboard data={dashboardData} />
                </motion.div>
              }
            />
            <Route
              path="/books"
              element={
                <motion.div key="books" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <BooksPage token={token} />
                </motion.div>
              }
            />
            <Route
              path="/members"
              element={
                <motion.div key="members" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <MembersPage token={token} />
                </motion.div>
              }
            />
            <Route
              path="/issues"
              element={
                <motion.div key="issues" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <IssuesPage token={token} />
                </motion.div>
              }
            />
            <Route
              path="/fines"
              element={
                <motion.div key="fines" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <FinesPage token={token} />
                </motion.div>
              }
            />
            <Route
              path="/payments"
              element={
                <motion.div key="payments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <PaymentsPage token={token} />
                </motion.div>
              }
            />
            <Route
              path="/reports"
              element={
                <motion.div key="reports" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ReportsPage token={token} />
                </motion.div>
              }
            />
            <Route
              path="/users"
              element={
                <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <UsersPage token={token} />
                </motion.div>
              }
            />
            <Route
              path="/settings"
              element={
                <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <SettingsPage token={token} />
                </motion.div>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
