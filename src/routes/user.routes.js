const express = require('express');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { ROLES, ROLE_PERMISSIONS, PERMISSIONS, AUDIT_ACTIONS } = require('../config/constants');
const { permissionMiddleware, ownerOnlyMiddleware } = require('../middleware/auth');

const router = express.Router();
const canManageUsers = permissionMiddleware([PERMISSIONS.VIEW_USERS]);

router.get('/', canManageUsers, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, role, status } = req.query;
    const filter = { isOwner: { $ne: true } };
    if (search) filter.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
      { phone: new RegExp(search, 'i') }
    ];
    if (role) filter.role = role;
    if (status) filter.status = status;
    const skip = (Math.max(Number(page), 1) - 1) * Math.min(Number(limit), 100);
    const pageSize = Math.min(Math.max(Number(limit), 1), 100);
    const [users, total] = await Promise.all([
      User.find(filter).select('-passwordHash').sort({ createdAt: -1 }).skip(skip).limit(pageSize),
      User.countDocuments(filter)
    ]);
    res.json({ success: true, data: users, pagination: { page: Number(page), limit: pageSize, total, pages: Math.ceil(total / pageSize) } });
  } catch (error) { next(error); }
});

router.post('/', ownerOnlyMiddleware, async (req, res, next) => {
  try {
    const { name, email, password, role = ROLES.STAFF, phone, department } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'name, email and password are required' });
    if (role === ROLES.OWNER) return res.status(403).json({ success: false, message: 'Owner account cannot be created through this endpoint' });
    if (!Object.values(ROLES).includes(role)) return res.status(400).json({ success: false, message: 'Invalid role' });
    const bcrypt = require('bcryptjs');
    const user = await User.create({ name, email, phone, department, role, permissions: ROLE_PERMISSIONS[role], passwordHash: await bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS) || 10), createdBy: req.user._id });
    await AuditLog.create({ user: req.user._id, role: req.user.role, action: AUDIT_ACTIONS.CREATE, module: 'USERS', recordId: user.id, newValue: { name, email, role }, ipAddress: req.userIP });
    res.status(201).json({ success: true, data: user.toObject({ transform: (_, ret) => { delete ret.passwordHash; return ret; } }) });
  } catch (error) { next(error); }
});

router.patch('/:id', ownerOnlyMiddleware, async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isOwner: { $ne: true } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const allowed = ['name', 'phone', 'department', 'status', 'role', 'permissions'];
    const oldValue = {};
    for (const key of allowed) if (req.body[key] !== undefined) { oldValue[key] = user[key]; user[key] = req.body[key]; }
    if (req.body.role) user.permissions = ROLE_PERMISSIONS[req.body.role] || [];
    user.updatedBy = req.user._id;
    await user.save();
    await AuditLog.create({ user: req.user._id, role: req.user.role, action: AUDIT_ACTIONS.UPDATE, module: 'USERS', recordId: user.id, oldValue, newValue: req.body, ipAddress: req.userIP });
    res.json({ success: true, data: user });
  } catch (error) { next(error); }
});

router.delete('/:id', ownerOnlyMiddleware, async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isOwner: { $ne: true } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.status = 'INACTIVE';
    user.updatedBy = req.user._id;
    await user.save();
    await AuditLog.create({ user: req.user._id, role: req.user.role, action: AUDIT_ACTIONS.SOFT_DELETE, module: 'USERS', recordId: user.id, ipAddress: req.userIP });
    res.json({ success: true, message: 'User deactivated successfully' });
  } catch (error) { next(error); }
});

module.exports = router;
