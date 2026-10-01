import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiBookOpen, FiCalendar, FiCheckCircle, FiClock } from 'react-icons/fi';

const issueData = [
  { id: 'ISS-001', member: 'Aditi Sharma', book: 'Atomic Habits', dueDate: '2026-10-05', status: 'Issued' },
  { id: 'ISS-002', member: 'Rahul Verma', book: 'Deep Work', dueDate: '2026-10-02', status: 'Overdue' },
  { id: 'ISS-003', member: 'Neha Singh', book: 'The Alchemist', dueDate: '2026-10-07', status: 'Returned' },
  { id: 'ISS-004', member: 'Vikram Singh', book: 'Rich Dad Poor Dad', dueDate: '2026-10-09', status: 'Issued' },
];

const IssuesPage = () => {
  const [issues] = useState(issueData);

  const getStatusCls = (status) => {
    if (status === 'Overdue') return 'bg-red-100 text-red-700';
    if (status === 'Returned') return 'bg-emerald-100 text-emerald-700';
    return 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-violet-600">Circulation</p>
        <h1 className="text-3xl font-bold text-slate-900">Issue Tracking</h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Issues', value: 128, icon: FiBookOpen, tone: 'cyan' },
          { label: 'Due Soon', value: 34, icon: FiCalendar, tone: 'amber' },
          { label: 'Returned', value: 412, icon: FiCheckCircle, tone: 'green' },
          { label: 'Overdue', value: 12, icon: FiClock, tone: 'red' },
        ].map((item) => (
          <motion.div key={item.label} whileHover={{ y: -5 }} className="bg-white rounded-3xl shadow-md border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <item.icon className={`text-${item.tone}-500 text-2xl`} />
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Live</span>
            </div>
            <div className="text-3xl font-black text-slate-900">{item.value}</div>
            <div className="text-slate-600 mt-1">{item.label}</div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Issue ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Member</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Book</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Due Date</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue, index) => (
                <motion.tr key={issue.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{issue.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{issue.member}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{issue.book}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{issue.dueDate}</td>
                  <td className="px-6 py-4"><span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusCls(issue.status)}`}>{issue.status}</span></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default IssuesPage;
