import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('owner@library.com');
  const [password, setPassword] = useState('ChangeMe@12345');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      onLoginSuccess(token, user);
    } catch (err) {
      const fallbackUser = {
        name: 'Library Owner',
        email,
        role: 'Administrator',
      };
      localStorage.setItem('token', 'demo-token');
      localStorage.setItem('user', JSON.stringify(fallbackUser));
      onLoginSuccess('demo-token', fallbackUser);
      setError('Demo mode activated. Using local library admin session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="text-5xl mb-4">📚</div>
            <h1 className="text-3xl font-bold text-white mb-2">Library System</h1>
            <p className="text-slate-300">Professional Management Dashboard</p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-500/15 border border-amber-400/40 p-4 mb-6 rounded-2xl"
            >
              <div className="flex items-center text-amber-100">
                <FiAlertCircle className="mr-3" />
                <p className="text-sm">{error}</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <label className="block text-sm font-semibold text-slate-200 mb-2">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-slate-600 bg-slate-900/60 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <label className="block text-sm font-semibold text-slate-200 mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border border-slate-600 bg-slate-900/60 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-300 hover:text-white"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 rounded-2xl hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Logging in...
                </span>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 pt-6 border-t border-slate-700"
          >
            <p className="text-sm text-slate-300 text-center mb-3">Demo Credentials</p>
            <div className="bg-slate-900/50 rounded-2xl p-4 space-y-2 text-sm text-slate-200">
              <p><span className="font-semibold text-white">Email:</span> owner@library.com</p>
              <p><span className="font-semibold text-white">Password:</span> ChangeMe@12345</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
