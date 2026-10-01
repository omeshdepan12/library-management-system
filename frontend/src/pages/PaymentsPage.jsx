import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

const fines = [
  { id: 'FN-101', member: 'Rahul Verma', amount: 250, status: 'Pending' },
  { id: 'FN-102', member: 'Aditi Sharma', amount: 120, status: 'Paid' },
  { id: 'FN-103', member: 'Vikram Singh', amount: 380, status: 'Pending' },
  { id: 'FN-104', member: 'Neha Singh', amount: 90, status: 'Paid' },
];

const FinesPage = () => {
  const [records] = useState(fines);
  const totalPending = records.filter((item) => item.status === 'Pending').reduce((sum, item) => sum + item.amount, 0);
  const totalPaid = records.filter((item) => item.status === 'Paid').reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-orange-600">Finance</p>
        <h1 className="text-3xl font-bold text-slate-900">Fines Management</h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div whileHover={{ y: -5 }} className="bg-white rounded-3xl shadow-md border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-2"><FiDollarSign className="text-emerald-500 text-2xl" /><span className="text-xs uppercase tracking-[0.2em] text-slate-400">Collected</span></div>
          <div className="text-3xl font-black text-slate-900">₹{totalPaid}</div>
          <div className="text-slate-600 mt-1">Paid fines</div>
        </motion.div>
        <motion.div whileHover={{ y: -5 }} className="bg-white rounded-3xl shadow-md border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-2"><FiAlertTriangle className="text-amber-500 text-2xl" /><span className="text-xs uppercase tracking-[0.2em] text-slate-400">Pending</span></div>
          <div className="text-3xl font-black text-slate-900">₹{totalPending}</div>
          <div className="text-slate-600 mt-1">Outstanding dues</div>
        </motion.div>
        <motion.div whileHover={{ y: -5 }} className="bg-white rounded-3xl shadow-md border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-2"><FiCheckCircle className="text-cyan-500 text-2xl" /><span className="text-xs uppercase tracking-[0.2em] text-slate-400">Recovery</span></div>
          <div className="text-3xl font-black text-slate-900">84%</div>
          <div className="text-slate-600 mt-1">Collection rate</div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Fine ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Member</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((item, index) => (
                <motion.tr key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{item.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{item.member}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">₹{item.amount}</td>
                  <td className="px-6 py-4"><span className={`text-xs font-bold px-3 py-1 rounded-full ${item.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{item.status}</span></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default FinesPage;
