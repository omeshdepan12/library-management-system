import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiBookOpen, FiUsers, FiTrendingUp, FiBell, FiSearch, FiStar, FiArrowRight } from 'react-icons/fi';

const premiumStats = [
  { label: 'Total Books', value: 1248, color: 'from-blue-500 to-cyan-400', icon: FiBookOpen },
  { label: 'Active Members', value: 356, color: 'from-violet-500 to-purple-400', icon: FiUsers },
  { label: 'Monthly Issues', value: 192, color: 'from-emerald-500 to-green-400', icon: FiTrendingUp },
  { label: 'Alerts', value: 12, color: 'from-amber-500 to-orange-400', icon: FiBell },
];

const featuredBooks = [
  { title: 'Atomic Habits', author: 'James Clear', progress: 74, status: 'Popular', accent: 'from-blue-500 to-cyan-400' },
  { title: 'The Alchemist', author: 'Paulo Coelho', progress: 58, status: 'Trending', accent: 'from-violet-500 to-purple-400' },
  { title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', progress: 86, status: 'Most Issued', accent: 'from-emerald-500 to-green-400' },
];

const quickActions = [
  'Issue Book',
  'Add Member',
  'Generate Report',
  'Fine Collection',
];

const PremiumDashboard = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen bg-[#0b1020] text-white p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8"
        >
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Library Insights</p>
            <h1 className="text-4xl font-bold mt-2">Premium Dashboard</h1>
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative w-full lg:w-80">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Search books, members, reports..."
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-3 rounded-2xl font-semibold"
            >
              + New Entry
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {premiumStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`bg-gradient-to-br ${stat.color} p-[1px] rounded-3xl shadow-2xl`}
              >
                <div className="bg-slate-950/90 h-full rounded-3xl p-5">
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-3 rounded-2xl bg-white/10">
                      <Icon size={22} />
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Today</span>
                  </div>
                  <div className="text-4xl font-black">{stat.value}</div>
                  <div className="text-slate-300 mt-2">{stat.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_0.9fr] gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-900/80 border border-slate-700 rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-slate-400">Featured Collection</p>
                  <h2 className="text-2xl font-bold">Most Requested Books</h2>
                </div>
                <button className="text-cyan-400 flex items-center gap-2 text-sm font-semibold">
                  View all <FiArrowRight />
                </button>
              </div>

              <div className="space-y-4">
                {featuredBooks.map((book, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center gap-4 bg-slate-800/80 border border-slate-700 rounded-2xl p-4"
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${book.accent} flex items-center justify-center text-2xl font-black`}>
                      {book.title[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-lg">{book.title}</h3>
                          <p className="text-sm text-slate-400">by {book.author}</p>
                        </div>
                        <span className="text-xs uppercase tracking-[0.2em] text-cyan-300 bg-cyan-500/10 px-2 py-1 rounded-full">
                          {book.status}
                        </span>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Popularity</span>
                          <span>{book.progress}%</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${book.progress}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className={`h-full rounded-full bg-gradient-to-r ${book.accent}`}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900/80 border border-slate-700 rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Quick Actions</h2>
                <FiStar className="text-yellow-400" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-2xl p-4 text-left bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 hover:border-cyan-400 transition"
                  >
                    <div className="text-sm text-slate-300">Action</div>
                    <div className="mt-2 text-xl font-bold">{action}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-900/80 border border-slate-700 rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-slate-400">Performance</p>
                  <h2 className="text-2xl font-bold">Revenue Overview</h2>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-emerald-400">₹84.2K</div>
                  <div className="text-xs text-emerald-300">+18.5% this month</div>
                </div>
              </div>

              <div className="space-y-4">
                {[65, 82, 58, 91, 74, 88].map((value, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-xs text-slate-400 mb-2">
                      <span>Week {idx + 1}</span>
                      <span>{value}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                        className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/80 border border-slate-700 rounded-3xl p-6 shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-6">Staff Summary</h2>
              <div className="space-y-4">
                {[
                  { name: 'Priya Sharma', role: 'Librarian', status: 'Online' },
                  { name: 'Rahul Verma', role: 'Cataloguer', status: 'Busy' },
                  { name: 'Neha Singh', role: 'Support', status: 'Offline' },
                ].map((member, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/80 border border-slate-700"
                  >
                    <div>
                      <div className="font-semibold">{member.name}</div>
                      <div className="text-sm text-slate-400">{member.role}</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      member.status === 'Online'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : member.status === 'Busy'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-slate-500/20 text-slate-300'
                    }`}>
                      {member.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumDashboard;
