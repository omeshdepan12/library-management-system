const express = require('express');
const Payment = require('../models/Payment');
const Fine = require('../models/Fine');
const { permissionMiddleware } = require('../middleware/auth');
const { PERMISSIONS, PAYMENT_STATUS } = require('../config/constants');
const crypto = require('crypto');

const router = express.Router();
const id = (prefix) => `${prefix}-${crypto.randomUUID()}`;
const generateReceipt = () => `RCP-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

router.get('/', permissionMiddleware([PERMISSIONS.VIEW_PAYMENTS]), async (req, res, next) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.member) filter.member = req.query.member;
    const [data, total] = await Promise.all([
      Payment.find(filter).populate('member collectedBy').sort({ date: -1 }).skip((page - 1) * limit).limit(limit),
      Payment.countDocuments(filter)
    ]);
    res.json({ success: true, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
});

router.get('/:id', permissionMiddleware([PERMISSIONS.VIEW_PAYMENTS]), async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('member collectedBy');
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    res.json({ success: true, data: payment });
  } catch (error) { next(error); }
});

router.post('/', permissionMiddleware([PERMISSIONS.CREATE_PAYMENT]), async (req, res, next) => {
  try {
    const { member, amount, paymentType, paymentMethod, reference } = req.body;
    if (!member || !amount || !paymentType || !paymentMethod) return res.status(400).json({ success: false, message: 'member, amount, paymentType and paymentMethod are required' });
    const payment = await Payment.create({
      paymentId: id('PAY'),
      member,
      amount: Number(amount),
      paymentType,
      paymentMethod,
      receiptNumber: generateReceipt(),
      collectedBy: req.user._id,
      reference,
      status: PAYMENT_STATUS.COMPLETED
    });
    res.status(201).json({ success: true, data: payment });
  } catch (error) { next(error); }
});

router.get('/:id/receipt', permissionMiddleware([PERMISSIONS.VIEW_PAYMENTS]), async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('member collectedBy');
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    const receipt = {
      receiptNumber: payment.receiptNumber,
      date: payment.date,
      member: payment.member.name,
      amount: payment.amount,
      paymentType: payment.paymentType,
      paymentMethod: payment.paymentMethod,
      collectedBy: payment.collectedBy.name
    };
    res.json({ success: true, data: receipt });
  } catch (error) { next(error); }
});

module.exports = router;
