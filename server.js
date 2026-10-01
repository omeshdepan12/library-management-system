const app = require('./src/app');
const connectDB = require('./src/config/database');
const { seedOwnerAccount } = require('./src/scripts/seed');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Database Connection
connectDB().then(async () => {
  console.log('✅ Database connected successfully');
  
  // Seed owner account if not exists
  await seedOwnerAccount();
  
  // Start Server
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 Library Management System - ${process.env.NODE_ENV} mode`);
  });
}).catch(err => {
  console.error('❌ Database connection failed:', err);
  process.exit(1);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
