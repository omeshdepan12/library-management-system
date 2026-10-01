const express = require('express');
const AuditLog = require('../models/AuditLog');
const { permissionMiddleware } = require('../middleware/auth');
const { PERMISSIONS } = require('../config/constants');

const router = express.Router();

router.get('/', permissionMiddleware([PERMISSIONS.VIEW_AUDIT_LOGS]), async (req, res, next) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 50, 1), 100);
    const filter = {};
    if (req.query.user) filter.user = req.query.user;
    if (req.query.module) filter.module = req.query.module;
    if (req.query.action) filter.action = req.query.action;
    if (req.query.startDate) filter.createdAt = { $gte: new Date(req.query.startDate) };
    if (req.query.endDate) {
      const endDate = new Date(req.query.endDate);
      endDate.setHours(23, 59, 59, 999);
      if (filter.createdAt) filter.createdAt.$lte = endDate;
      else filter.createdAt = { $lte: endDate };
    }
    const [data, total] = await Promise.all([
      AuditLog.find(filter).populate('user').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      AuditLog.countDocuments(filter)
    ]);
    res.json({ success: true, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
});

router.get('/export', permissionMiddleware([PERMISSIONS.VIEW_AUDIT_LOGS]), async (req, res, next) => {
  try {
    const logs = await AuditLog.find({}).populate('user').sort({ createdAt: -1 }).limit(10000);
    const csv = ['User,Role,Action,Module,Record ID,Date,Time,IP Address'].concat(
      logs.map(log => `"${log.user?.email || 'System'}","${log.role}","${log.action}","${log.module}","${log.recordId || ''}","${log.createdAt.toLocaleDateString()}","${log.createdAt.toLocaleTimeString()}","${log.ipAddress || ''}"`.replace(/"/g, '""'))
    ).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="audit-logs-${Date.now()}.csv"`);
    res.send(csv);
  } catch (error) { next(error); }
});

module.exports = router;
