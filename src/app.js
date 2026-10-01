const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const bookRoutes = require('./routes/book.routes');
const memberRoutes = require('./routes/member.routes');
const issueRoutes = require('./routes/issue.routes');
const fineRoutes = require('./routes/fine.routes');
const paymentRoutes = require('./routes/payment.routes');
const reservationRoutes = require('./routes/reservation.routes');
const reportRoutes = require('./routes/report.routes');
const auditRoutes = require('./routes/audit.routes');
const settingRoutes = require('./routes/setting.routes');
const notificationRoutes = require('./routes/notification.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const { errorHandler } = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/auth');

const app = express();

// Security Middleware
app.use(helmet());

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Compression
app.use(compression());

// Logging
app.use(morgan('combined'));

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Public Routes
app.use('/api/auth', authRoutes);

// Protected Routes (require authentication)
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/books', authMiddleware, bookRoutes);
app.use('/api/members', authMiddleware, memberRoutes);
app.use('/api/issues', authMiddleware, issueRoutes);
app.use('/api/fines', authMiddleware, fineRoutes);
app.use('/api/payments', authMiddleware, paymentRoutes);
app.use('/api/reservations', authMiddleware, reservationRoutes);
app.use('/api/reports', authMiddleware, reportRoutes);
app.use('/api/audit-logs', authMiddleware, auditRoutes);
app.use('/api/settings', authMiddleware, settingRoutes);
app.use('/api/notifications', authMiddleware, notificationRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Error Handler (must be last)
app.use(errorHandler);

module.exports = app;
