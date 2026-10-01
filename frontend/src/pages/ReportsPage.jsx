import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCreditCard, FiTrendingUp, FiWallet } from 'react-icons/fi';

const paymentData = [
  { id: 'PAY-1001', member: 'Aditi Sharma', method: 'UPI', amount: 420, date: '2026-10-01' },
  { id: 'PAY-1002', member: 'Rahul Verma', method: 'Card', amount: 680, date: '2026-09-30' },
  { id: 'PAY-1003', member: 'Neha Singh', method: 'Cash', amount: 150, date: '2026-09-28' },
  { id: 'PAY-1004', member: 'Vikram Singh', method: 'UPI', amount: 540, date: '2026-09-25' },
];

const PaymentsPage = () => {
  const [payments] = useState(paymentData);
  const total = payments.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-600">Transactions</p>
        <h1 className="text-3xl font-bold text-slate-900">Payments Overview</h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div whileHover={{ y: -5 }} className="bg-white rounded-3xl shadow-md border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-2"><FiWallet className="text-cyan-500 text-2xl" /><span className="text-xs uppercase tracking-[0.2em] text-slate-400">Total</span></div>
          <div className="text-3xl font-black text-slate-900">₹{total}</div>
          <div className="text-slate-600 mt-1">This month</div>
        </motion.div>
        <motion.div whileHover={{ y: -5 }} className="bg-white rounded-3xl shadow-md border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-2"><FiCreditCard className="text-violet-500 text-2xl" /><span className="text-xs uppercase tracking-[0.2em] text-slate-400">Methods</span></div>
          <div className="text-3xl font-black text-slate-900">4</div>
          <div className="text-slate-600 mt-1">Modes used</div>
        </motion.div>
        <motion.div whileHover={{ y: -5 }} className="bg-white rounded-3xl shadow-md border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-2"><FiTrendingUp className="text-emerald-500 text-2xl" /><span className="text-xs uppercase tracking-[0.2em] text-slate-400">Growth</span></div>
          <div className="text-3xl font-black text-slate-900">+18%</div>
          <div className="text-slate-600 mt-1">vs last month</div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Payment ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Member</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Method</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((item, index) => (
                <motion.tr key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{item.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{item.member}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{item.method}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">₹{item.amount}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{item.date}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentsPage;
