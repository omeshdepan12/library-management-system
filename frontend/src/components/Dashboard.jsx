import React from 'react';
import { motion } from 'framer-motion';
import { FiBook, FiUsers, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';

const AnimatedCounter = ({ value, label, icon: Icon, color = 'blue' }) => {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    const duration = 2; // 2 seconds animation
    const steps = 60;
    const increment = value / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      if (currentStep < steps) {
        currentStep++;
        setDisplayValue(Math.floor(increment * currentStep));
      } else {
        setDisplayValue(value);
        clearInterval(timer);
      }
    }, (duration * 1000) / steps);

    return () => clearInterval(timer);
  }, [value]);

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 shadow-blue-500/50',
    green: 'from-green-500 to-green-600 shadow-green-500/50',
    orange: 'from-orange-500 to-orange-600 shadow-orange-500/50',
    red: 'from-red-500 to-red-600 shadow-red-500/50',
    purple: 'from-purple-500 to-purple-600 shadow-purple-500/50',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.05, y: -10 }}
      className="relative overflow-hidden"
    >
      <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl p-6 text-white shadow-2xl backdrop-blur-lg border border-white/20`}>
        {/* Animated background gradient */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full"
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl"
            >
              <Icon />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full"
            >
              Live
            </motion.div>
          </div>

          <motion.div
            key={displayValue}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-5xl font-bold mb-2"
          >
            {displayValue.toLocaleString()}
          </motion.div>

          <p className="text-sm font-medium text-white/80">{label}</p>
        </div>
      </div>
    </motion.div>
  );
};

const DashboardCard = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow"
  >
    <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
    {children}
  </motion.div>
);

const Dashboard = ({ data }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">📚 Library Dashboard</h1>
        <p className="text-gray-600">Real-time library management system analytics</p>
      </motion.div>

      {/* Main Metrics Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <AnimatedCounter
          value={data?.totalBooks || 0}
          label="Total Books"
          icon={FiBook}
          color="blue"
        />
        <AnimatedCounter
          value={data?.availableBooks || 0}
          label="Available Books"
          icon={FiBook}
          color="green"
        />
        <AnimatedCounter
          value={data?.issuedBooks || 0}
          label="Issued Books"
          icon={FiTrendingUp}
          color="orange"
        />
        <AnimatedCounter
          value={data?.overdueBooks || 0}
          label="Overdue Books"
          icon={FiAlertCircle}
          color="red"
        />
      </motion.div>

      {/* Secondary Metrics */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
      >
        <AnimatedCounter
          value={data?.totalMembers || 0}
          label="Total Members"
          icon={FiUsers}
          color="purple"
        />
        <AnimatedCounter
          value={data?.activeMembers || 0}
          label="Active Members"
          icon={FiUsers}
          color="green"
        />
        <AnimatedCounter
          value={data?.totalStaff || 0}
          label="Total Staff"
          icon={FiUsers}
          color="blue"
        />
      </motion.div>

      {/* Daily Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
      >
        <DashboardCard title="Today's Activity">
          <div className="space-y-4">
            <motion.div
              variants={itemVariants}
              className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg"
            >
              <span className="text-gray-700 font-medium">Issues</span>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-blue-600"
              >
                {data?.todaysIssues || 0}
              </motion.span>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg"
            >
              <span className="text-gray-700 font-medium">Returns</span>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-green-600"
              >
                {data?.todaysReturns || 0}
              </motion.span>
            </motion.div>
          </div>
        </DashboardCard>

        <DashboardCard title="Financial Overview">
          <div className="space-y-4">
            <motion.div
              variants={itemVariants}
              className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg"
            >
              <span className="text-gray-700 font-medium">Collected Fines</span>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-emerald-600"
              >
                ₹{(data?.collectedFine || 0).toLocaleString()}
              </motion.span>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg"
            >
              <span className="text-gray-700 font-medium">Pending Fines</span>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-yellow-600"
              >
                ₹{(data?.pendingFines || 0).toLocaleString()}
              </motion.span>
            </motion.div>
          </div>
        </DashboardCard>
      </motion.div>

      {/* Bottom Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <DashboardCard title="Revenue">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <div className="text-4xl font-bold text-green-600 mb-2">
              ₹{(data?.monthlyRevenue || 0).toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Monthly Revenue</p>
          </motion.div>
        </DashboardCard>

        <DashboardCard title="Reserved Books">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {data?.reservedBooks || 0}
            </div>
            <p className="text-sm text-gray-600">Active Reservations</p>
          </motion.div>
        </DashboardCard>

        <DashboardCard title="Net Collection">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <div className="text-4xl font-bold text-indigo-600 mb-2">
              ₹{(data?.netCollection || 0).toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Monthly Collection</p>
          </motion.div>
        </DashboardCard>
      </motion.div>
    </div>
  );
};

export default Dashboard;
