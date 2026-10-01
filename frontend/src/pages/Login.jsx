import React from 'react';
import { motion } from 'framer-motion';
import {
  FiHome,
  FiBook,
  FiUsers,
  FiCheckSquare,
  FiCreditCard,
  FiBarChart3,
  FiShield,
  FiSettings,
} from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', icon: FiHome, path: '/' },
    { label: 'Books', icon: FiBook, path: '/books' },
    { label: 'Members', icon: FiUsers, path: '/members' },
    { label: 'Issues', icon: FiCheckSquare, path: '/issues' },
    { label: 'Fines', icon: FiCreditCard, path: '/fines' },
    { label: 'Payments', icon: FiCreditCard, path: '/payments' },
    { label: 'Reports', icon: FiBarChart3, path: '/reports' },
    { label: 'Users', icon: FiShield, path: '/users' },
    { label: 'Settings', icon: FiSettings, path: '/settings' },
  ];

  return (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
        />
      )}

      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        className="w-80 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white p-6 fixed lg:static inset-y-0 left-0 z-40 overflow-y-auto shadow-2xl"
      >
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-2xl shadow-lg mb-4">
            📚
          </div>
          <h1 className="text-3xl font-bold">Library</h1>
          <p className="text-slate-400 text-sm mt-1">Management System</p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <Link
                  to={item.path}
                  onClick={() => onClose?.()}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl transition ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {isActive && <div className="w-2 h-2 rounded-full bg-white" />}
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </motion.aside>
    </>
  );
};

export default Sidebar;
