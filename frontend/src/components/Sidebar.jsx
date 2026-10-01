import React from 'react';
import { motion } from 'framer-motion';
import { FiHome, FiBook, FiUsers, FiCheckSquare, FiCreditCard, FiBarChart3, FiShield, FiSettings, FiLogOut } from 'react-icons/fi';
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
      {/* Backdrop for mobile */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-80 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 fixed lg:static inset-y-0 left-0 z-40 overflow-y-auto"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">📚 Library</h1>
          <p className="text-gray-400 text-sm">Management System</p>
        </motion.div>

        {/* Menu Items */}
        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={item.path}
                  onClick={() => onClose?.()}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-2 h-2 bg-white rounded-full"
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </motion.div>
    </>
  );
};

export default Sidebar;
