const AuditLog = require('../models/AuditLog');

const errorHandler = async (err, req, res, next) => {
  console.error('\u274c Error:', err);

  // Log critical errors
  if (req.user) {
    try {
      await AuditLog.create({
        user: req.user._id,
        role: req.user.role,
        action: 'ERROR',
        module: req.baseUrl,
        ipAddress: req.userIP,
        userAgent: req.headers['user-agent'],
        oldValue: { error: err.message }
      });
    } catch (logError) {
      console.error('Error logging audit log:', logError);
    }
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  // Duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
      field
    });
  }

  // Cast errors
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = { errorHandler };
