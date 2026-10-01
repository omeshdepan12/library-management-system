const express = require('express');
const Fine = require('../models/Fine');
const { permissionMiddleware } = require('../middleware/auth');
const { PERMISSIONS, FINE_STATUS } = require('../config/constants');
const crypto = require('crypto');

const router = express.Router();
const id = (prefix) => `${prefix}-${crypto.randomUUID()}`;

router.get('/', permissionMiddleware([PERMISSIONS.VIEW_FINES]), async (req, res, next) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.member) filter.member = req.query.member;
    const [data, total] = await Promise.all([
      Fine.find(filter).populate('member book issue').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Fine.countDocuments(filter)
    ]);
    res.json({ success: true, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
});

router.get('/:id', permissionMiddleware([PERMISSIONS.VIEW_FINES]), async (req, res, next) => {
  try {
    const fine = await Fine.findById(req.params.id).populate('member book issue');
    if (!fine) return res.status(404).json({ success: false, message: 'Fine not found' });
    res.json({ success: true, data: fine });
  } catch (error) { next(error); }
});

router.post('/', permissionMiddleware([PERMISSIONS.MANAGE_FINES]), async (req, res, next) => {
  try {
    const { member, reason, amount } = req.body;
    if (!member || !reason || amount === undefined) return res.status(400).json({ success: false, message: 'member, reason and amount are required' });
    const fine = await Fine.create({
      fineId: id('FINE'),
      member,
      reason,
      amount: Number(amount),
      status: FINE_STATUS.PENDING
    });
    res.status(201).json({ success: true, data: fine });
  } catch (error) { next(error); }
});

router.patch('/:id/pay', permissionMiddleware([PERMISSIONS.MANAGE_FINES]), async (req, res, next) => {
  try {
    const { paidAmount, paymentMethod } = req.body;
    const fine = await Fine.findById(req.params.id);
    if (!fine) return res.status(404).json({ success: false, message: 'Fine not found' });
    const numAmount = Number(paidAmount);
    const newPaidAmount = fine.paidAmount + numAmount;
    if (newPaidAmount > fine.amount) return res.status(400).json({ success: false, message: 'Payment exceeds fine amount' });
    fine.paidAmount = newPaidAmount;
    fine.paymentMethod = paymentMethod || fine.paymentMethod;
    fine.collectedBy = req.user._id;
    fine.status = newPaidAmount === fine.amount ? FINE_STATUS.PAID : FINE_STATUS.PARTIALLY_PAID;
    await fine.save();
    res.json({ success: true, data: fine });
  } catch (error) { next(error); }
});

router.patch('/:id/waive', permissionMiddleware([PERMISSIONS.WAIVE_FINES]), async (req, res, next) => {
  try {
    const fine = await Fine.findByIdAndUpdate(req.params.id, { status: FINE_STATUS.WAIVED }, { new: true });
    if (!fine) return res.status(404).json({ success: false, message: 'Fine not found' });
    res.json({ success: true, data: fine });
  } catch (error) { next(error); }
});

module.exports = router;
