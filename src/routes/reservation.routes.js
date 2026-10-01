const express = require('express');
const crypto = require('crypto');
const Reservation = require('../models/Reservation');
const Book = require('../models/Book');
const Issue = require('../models/Issue');
const { permissionMiddleware } = require('../middleware/auth');
const { PERMISSIONS, RESERVATION_STATUS, ISSUE_STATUS } = require('../config/constants');

const router = express.Router();
const id = (prefix) => `${prefix}-${crypto.randomUUID()}`;

router.get('/', permissionMiddleware([PERMISSIONS.VIEW_RESERVATIONS]), async (req, res, next) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.member) filter.member = req.query.member;
    const [data, total] = await Promise.all([
      Reservation.find(filter).populate('member book').sort({ queuePosition: 1 }).skip((page - 1) * limit).limit(limit),
      Reservation.countDocuments(filter)
    ]);
    res.json({ success: true, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
});

router.post('/', permissionMiddleware([PERMISSIONS.VIEW_RESERVATIONS]), async (req, res, next) => {
  try {
    const { member, book } = req.body;
    if (!member || !book) return res.status(400).json({ success: false, message: 'member and book are required' });
    const existingReservation = await Reservation.findOne({ member, book, status: { $ne: RESERVATION_STATUS.CANCELLED } });
    if (existingReservation) return res.status(409).json({ success: false, message: 'Member already has a reservation for this book' });
    const lastPosition = await Reservation.findOne({ book, status: RESERVATION_STATUS.PENDING }).sort({ queuePosition: -1 });
    const queuePosition = (lastPosition?.queuePosition || 0) + 1;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    const reservation = await Reservation.create({
      reservationId: id('RES'),
      member,
      book,
      queuePosition,
      expiryDate,
      status: RESERVATION_STATUS.PENDING
    });
    res.status(201).json({ success: true, data: reservation });
  } catch (error) { next(error); }
});

router.patch('/:id/cancel', permissionMiddleware([PERMISSIONS.VIEW_RESERVATIONS]), async (req, res, next) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(req.params.id, { status: RESERVATION_STATUS.CANCELLED }, { new: true });
    if (!reservation) return res.status(404).json({ success: false, message: 'Reservation not found' });
    res.json({ success: true, data: reservation });
  } catch (error) { next(error); }
});

router.post('/:id/fulfill', permissionMiddleware([PERMISSIONS.APPROVE_RESERVATIONS]), async (req, res, next) => {
  try {
    const reservation = await Reservation.findOne({ _id: req.params.id, status: RESERVATION_STATUS.PENDING }).populate('member book');
    if (!reservation) return res.status(404).json({ success: false, message: 'Pending reservation not found' });
    reservation.status = RESERVATION_STATUS.FULFILLED;
    reservation.notifiedAt = new Date();
    await reservation.save();
    res.json({ success: true, message: 'Reservation fulfilled. Notification sent to member.', data: reservation });
  } catch (error) { next(error); }
});

module.exports = router;
