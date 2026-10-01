const express = require('express');
const Member = require('../models/Member');
const { permissionMiddleware } = require('../middleware/auth');
const { PERMISSIONS } = require('../config/constants');

const router = express.Router();
router.get('/', permissionMiddleware([PERMISSIONS.VIEW_MEMBERS]), async (req, res, next) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);
    const filter = { deletedAt: null };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) filter.$or = [{ name: new RegExp(req.query.search, 'i') }, { memberId: new RegExp(req.query.search, 'i') }, { mobile: new RegExp(req.query.search, 'i') }, { email: new RegExp(req.query.search, 'i') }];
    const [data, total] = await Promise.all([Member.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit), Member.countDocuments(filter)]);
    res.json({ success: true, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
});

router.get('/:id', permissionMiddleware([PERMISSIONS.VIEW_MEMBERS]), async (req, res, next) => {
  try {
    const member = await Member.findOne({ _id: req.params.id, deletedAt: null });
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    res.json({ success: true, data: member });
  } catch (error) { next(error); }
});

router.post('/', permissionMiddleware([PERMISSIONS.CREATE_MEMBER]), async (req, res, next) => {
  try {
    const member = await Member.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: member });
  } catch (error) { next(error); }
});

router.patch('/:id', permissionMiddleware([PERMISSIONS.EDIT_MEMBER]), async (req, res, next) => {
  try {
    const updates = { ...req.body, updatedBy: req.user._id };
    delete updates._id; delete updates.memberId; delete updates.deletedAt;
    const member = await Member.findOneAndUpdate({ _id: req.params.id, deletedAt: null }, { $set: updates }, { new: true, runValidators: true });
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    res.json({ success: true, data: member });
  } catch (error) { next(error); }
});

router.delete('/:id', permissionMiddleware([PERMISSIONS.DELETE_MEMBER]), async (req, res, next) => {
  try {
    const member = await Member.findOneAndUpdate({ _id: req.params.id, deletedAt: null }, { $set: { deletedAt: new Date(), status: 'INACTIVE', updatedBy: req.user._id } }, { new: true });
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    res.json({ success: true, message: 'Member deactivated successfully' });
  } catch (error) { next(error); }
});

module.exports = router;
