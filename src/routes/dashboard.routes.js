const express = require('express');
const Book = require('../models/Book');
const Member = require('../models/Member');
const User = require('../models/User');
const Issue = require('../models/Issue');
const Fine = require('../models/Fine');
const Payment = require('../models/Payment');
const Reservation = require('../models/Reservation');
const { permissionMiddleware } = require('../middleware/auth');
const { PERMISSIONS } = require('../config/constants');

const router = express.Router();
router.get('/', permissionMiddleware([PERMISSIONS.VIEW_DASHBOARD]), async (req, res, next) => {
  try {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const month = new Date(start.getFullYear(), start.getMonth(), 1);
    const [books, availableBooks, issuedBooks, overdueBooks, members, activeMembers, staff, todayIssues, todayReturns, pendingFines, collectedFine, pendingPayments, monthlyRevenue, monthlyExpenses, reservedBooks] = await Promise.all([
      Book.countDocuments({ deletedAt: null }),
      Book.aggregate([{ $match: { deletedAt: null } }, { $group: { _id: null, total: { $sum: '$availableQuantity' } } }]),
      Issue.countDocuments({ status: 'ACTIVE' }),
      Issue.countDocuments({ status: { $in: ['ACTIVE', 'OVERDUE'] }, dueDate: { $lt: new Date() } }),
      Member.countDocuments({ deletedAt: null }), Member.countDocuments({ status: 'ACTIVE', deletedAt: null }),
      User.countDocuments({ role: { $in: ['ADMIN', 'LIBRARIAN', 'STAFF'] }, status: 'ACTIVE' }),
      Issue.countDocuments({ issueDate: { $gte: start } }), Issue.countDocuments({ returnDate: { $gte: start } }),
      Fine.aggregate([{ $match: { status: { $in: ['PENDING', 'PARTIALLY_PAID'] } } }, { $group: { _id: null, total: { $sum: { $subtract: ['$amount', '$paidAmount'] } } } }]),
      Fine.aggregate([{ $match: { status: { $in: ['PAID', 'PARTIALLY_PAID'] } } }, { $group: { _id: null, total: { $sum: '$paidAmount' } } }]),
      Payment.aggregate([{ $match: { status: 'PENDING' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Payment.aggregate([{ $match: { status: 'COMPLETED', date: { $gte: month } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Promise.resolve([{ total: 0 }]), Reservation.countDocuments({ status: { $in: ['PENDING', 'AVAILABLE'] } })
    ]);
    const value = (result) => result[0]?.total || 0;
    res.json({ success: true, data: { totalBooks: books, availableBooks: value(availableBooks), issuedBooks, overdueBooks, totalMembers: members, activeMembers, totalStaff: staff, todaysIssues: todayIssues, todaysReturns: todayReturns, pendingFines: value(pendingFines), collectedFine: value(collectedFine), pendingPayments: value(pendingPayments), monthlyRevenue: value(monthlyRevenue), monthlyExpenses: value(monthlyExpenses), netCollection: value(monthlyRevenue) - value(monthlyExpenses), reservedBooks } });
  } catch (error) { next(error); }
});
module.exports = router;
