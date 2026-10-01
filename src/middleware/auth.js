const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { AUDIT_ACTIONS } = require('../config/constants');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No authentication token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('+passwordHash');

    if (!user || user.status !== 'ACTIVE') {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found or inactive' 
      });
    }

    if (user.lockedUntil && new Date() < user.lockedUntil) {
      return res.status(403).json({ 
        success: false, 
        message: 'Account is locked. Try again later.' 
      });
    }

    req.user = user;
    req.userIP = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};

const permissionMiddleware = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      
      // Owner has all permissions
      if (user.isOwner) {
        return next();
      }

      const hasPermission = requiredPermissions.every(permission => 
        user.permissions.includes(permission)
      );

      if (!hasPermission) {
        // Log unauthorized access attempt
        await AuditLog.create({
          user: user._id,
          role: user.role,
          action: 'UNAUTHORIZED_ACCESS',
          module: req.baseUrl,
          ipAddress: req.userIP,
          userAgent: req.headers['user-agent']
        });

        return res.status(403).json({ 
          success: false, 
          message: 'Insufficient permissions' 
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Permission check failed',
        error: error.message 
      });
    }
  };
};

const ownerOnlyMiddleware = async (req, res, next) => {
  try {
    const user = req.user;
    
    if (!user.isOwner) {
      await AuditLog.create({
        user: user._id,
        role: user.role,
        action: 'UNAUTHORIZED_ACCESS',
        module: 'OWNER_ONLY',
        ipAddress: req.userIP,
        userAgent: req.headers['user-agent']
      });

      return res.status(403).json({ 
        success: false, 
        message: 'Only Owner can access this resource' 
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Authorization check failed',
      error: error.message 
    });
  }
};

module.exports = {
  authMiddleware,
  permissionMiddleware,
  ownerOnlyMiddleware
};
