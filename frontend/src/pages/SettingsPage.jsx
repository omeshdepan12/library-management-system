import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiUserPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const users = [
  { id: 'USR-01', name: 'Library Owner', email: 'owner@library.com', role: 'Administrator', status: 'Active' },
  { id: 'USR-02', name: 'Priya Sharma', email: 'priya@library.com', role: 'Librarian', status: 'Active' },
  { id: 'USR-03', name: 'Rahul Jain', email: 'rahul@library.com', role: 'Support', status: 'Inactive' },
  { id: 'USR-04', name: 'Neha Kapoor', email: 'neha@library.com', role: 'Cataloguer', status: 'Active' },
];

const UsersPage = () => {
  const [records] = useState(users);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-sky-600">Access</p>
            <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg">
            <FiUserPlus /> <span>Add User</span>
          </motion.button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">User ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Role</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Status</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((user, index) => (
                <motion.tr key={user.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{user.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{user.role}</td>
                  <td className="px-6 py-4"><span className={`text-xs font-bold px-3 py-1 rounded-full ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>{user.status}</span></td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button className="text-blue-600 hover:text-blue-700"><FiEdit2 /></button>
                      <button className="text-red-500 hover:text-red-700"><FiTrash2 /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default UsersPage;
