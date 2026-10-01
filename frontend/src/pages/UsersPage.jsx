import React from 'react';
import { motion } from 'framer-motion';
import { FiBarChart2, FiPieChart, FiTrendingUp } from 'react-icons/fi';

const reportCards = [
  { title: 'Book Utilization', value: '81%', detail: '+9% from last month', tone: 'cyan' },
  { title: 'Member Retention', value: '92%', detail: '+4.8% from last month', tone: 'green' },
  { title: 'Late Returns', value: '7.2%', detail: '-2.1% from last month', tone: 'amber' },
  { title: 'Annual Revenue', value: '₹8.4L', detail: '+18.5% Y/Y', tone: 'violet' },
];

const ReportsPage = () => {
  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-indigo-600">Analytics</p>
        <h1 className="text-3xl font-bold text-slate-900">Reports & Insights</h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {reportCards.map((card, idx) => (
          <motion.div key={card.title} whileHover={{ y: -5 }} className="bg-white rounded-3xl border border-slate-200 shadow-md p-5">
            <div className="flex items-center justify-between mb-3">
              {card.tone === 'cyan' && <FiBarChart2 className="text-cyan-500 text-2xl" />}
              {card.tone === 'green' && <FiTrendingUp className="text-emerald-500 text-2xl" />}
              {card.tone === 'amber' && <FiPieChart className="text-amber-500 text-2xl" />}
              {card.tone === 'violet' && <FiTrendingUp className="text-violet-500 text-2xl" />}
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Report</span>
            </div>
            <div className="text-3xl font-black text-slate-900">{card.value}</div>
            <div className="text-slate-600 mt-1 text-sm">{card.detail}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Monthly Book Issuance</h2>
          <div className="space-y-5">
            {[68, 72, 81, 76, 90, 83, 94].map((value, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span>Week {index + 1}</span>
                  <span>{value}%</span>
                </div>
                <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.8, delay: index * 0.1 }} className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Resource Distribution</h2>
          <div className="space-y-4">
            {[
              { label: 'Books', value: 58, color: 'bg-cyan-500' },
              { label: 'Members', value: 24, color: 'bg-emerald-500' },
              { label: 'Fines', value: 12, color: 'bg-amber-500' },
              { label: 'Others', value: 6, color: 'bg-violet-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${item.value}%` }} transition={{ duration: 0.8 }} className={`h-full rounded-full ${item.color}`} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportsPage;
