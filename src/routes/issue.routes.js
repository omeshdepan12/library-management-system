const express = require('express');
const crypto = require('crypto');
const Issue = require('../models/Issue');
const Book = require('../models/Book');
const Member = require('../models/Member');
const Fine = require('../models/Fine');
const { permissionMiddleware } = require('../middleware/auth');
const { PERMISSIONS, ISSUE_STATUS, BOOK_STATUS } = require('../config/constants');
const id = (prefix) => `${prefix}-${crypto.randomUUID()}`;

const router = express.Router();
router.get('/', permissionMiddleware([PERMISSIONS.VIEW_ISSUES]), async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.member) filter.member = req.query.member;
    const issues = await Issue.find(filter).populate('member book issuedBy returnedBy').sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: issues });
  } catch (error) { next(error); }
});

router.post('/', permissionMiddleware([PERMISSIONS.CREATE_ISSUE]), async (req, res, next) => {
  try {
    const { member, book, dueDate } = req.body;
    if (!member || !book || !dueDate) return res.status(400).json({ success: false, message: 'member, book and dueDate are required' });
    const memberRecord = await Member.findOne({ _id: member, status: 'ACTIVE', deletedAt: null });
    if (!memberRecord) return res.status(400).json({ success: false, message: 'Active member not found' });
    const updatedBook = await Book.findOneAndUpdate({ _id: book, deletedAt: null, availableQuantity: { $gt: 0 } }, { $inc: { availableQuantity: -1 }, $set: { status: BOOK_STATUS.ISSUED } }, { new: true });
    if (!updatedBook) return res.status(409).json({ success: false, message: 'Book is unavailable' });
    try {
      const issue = await Issue.create({ issueId: id('ISS'), member, book, dueDate: new Date(dueDate), issuedBy: req.user._id });
      res.status(201).json({ success: true, data: issue });
    } catch (error) {
      await Book.findByIdAndUpdate(book, { $inc: { availableQuantity: 1 } });
      throw error;
    }
  } catch (error) { next(error); }
});

router.post('/:id/return', permissionMiddleware([PERMISSIONS.CREATE_RETURN]), async (req, res, next) => {
  try {
    const issue = await Issue.findOne({ _id: req.params.id, status: { $in: [ISSUE_STATUS.ACTIVE, ISSUE_STATUS.OVERDUE] } });
    if (!issue) return res.status(404).json({ success: false, message: 'Active issue not found' });
    const returnDate = req.body.returnDate ? new Date(req.body.returnDate) : new Date();
    const lateDays = Math.max(Math.ceil((returnDate - issue.dueDate) / 86400000), 0);
    const finePerDay = Number(process.env.FINE_PER_DAY) || 5;
    const fine = Math.min(lateDays * finePerDay, Number(process.env.MAX_FINE) || 500);
    issue.returnDate = returnDate; issue.returnedBy = req.user._id; issue.lateDays = lateDays; issue.fine = fine; issue.bookCondition = req.body.bookCondition; issue.damageOrLost = Boolean(req.body.damageOrLost); issue.status = ISSUE_STATUS.RETURNED;
    await issue.save();
    const book = await Book.findByIdAndUpdate(issue.book, { $inc: { availableQuantity: 1 }, $set: { status: BOOK_STATUS.AVAILABLE } }, { new: true });
    if (fine > 0) await Fine.create({ fineId: id('FINE'), member: issue.member, book: issue.book, issue: issue._id, reason: 'LATE_RETURN', amount: fine });
    res.json({ success: true, data: { issue, book, fine } });
  } catch (error) { next(error); }
});

module.exports = router;
