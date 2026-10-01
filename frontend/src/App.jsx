import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './components/Dashboard';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!token) {
          setError('Please login first');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDashboardData(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center">
          <h1 className="text-3xl font-bold mb-4">Library Management System</h1>
          <p className="text-gray-600 mb-6">Please login to access dashboard</p>
          <input
            type="text"
            placeholder="Enter token"
            onChange={(e) => {
              localStorage.setItem('token', e.target.value);
              setToken(e.target.value);
            }}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-md text-center">
          <p className="text-red-600 font-semibold mb-4">Error</p>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <Dashboard data={dashboardData} />;
}

export default App;
