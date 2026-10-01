const express = require('express');
const Book = require('../models/Book');
const Member = require('../models/Member');
const Issue = require('../models/Issue');
const Fine = require('../models/Fine');
const Payment = require('../models/Payment');
const { permissionMiddleware } = require('../middleware/auth');
const { PERMISSIONS } = require('../config/constants');

const router = express.Router();

const generateCSV = (data, headers) => {
  const csv = [headers.join(',')].concat(
    data.map(row => headers.map(h => `"${(row[h] || '').toString().replace(/"/g, '""')}"`).join(','))
  ).join('\n');
  return csv;
};

router.get('/books', permissionMiddleware([PERMISSIONS.EXPORT_REPORTS]), async (req, res, next) => {
  try {
    const books = await Book.find({ deletedAt: null }).lean();
    const csv = generateCSV(books, ['bookId', 'isbn', 'bookName', 'quantity', 'availableQuantity', 'status', 'price', 'location']);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="books-report-${Date.now()}.csv"`);
    res.send(csv);
  } catch (error) { next(error); }
});

router.get('/issues', permissionMiddleware([PERMISSIONS.EXPORT_REPORTS]), async (req, res, next) => {
  try {
    const issues = await Issue.find().populate('member book').lean();
    const csv = generateCSV(issues, ['issueId', 'member', 'book', 'issueDate', 'dueDate', 'returnDate', 'status', 'lateDays', 'fine']);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="issues-report-${Date.now()}.csv"`);
    res.send(csv);
  } catch (error) { next(error); }
});

router.get('/fines', permissionMiddleware([PERMISSIONS.EXPORT_REPORTS]), async (req, res, next) => {
  try {
    const fines = await Fine.find().populate('member').lean();
    const csv = generateCSV(fines, ['fineId', 'member', 'reason', 'amount', 'paidAmount', 'status', 'date']);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="fines-report-${Date.now()}.csv"`);
    res.send(csv);
  } catch (error) { next(error); }
});

router.get('/overdue', permissionMiddleware([PERMISSIONS.VIEW_REPORTS]), async (req, res, next) => {
  try {
    const overdue = await Issue.find({ status: 'OVERDUE', dueDate: { $lt: new Date() } }).populate('member book');
    res.json({ success: true, data: overdue });
  } catch (error) { next(error); }
});

router.get('/revenue', permissionMiddleware([PERMISSIONS.VIEW_REPORTS]), async (req, res, next) => {
  try {
    const startDate = new Date(req.query.startDate || new Date().setMonth(new Date().getMonth() - 1));
    const endDate = new Date(req.query.endDate || Date.now());
    const revenue = await Payment.aggregate([
      { $match: { date: { $gte: startDate, $lte: endDate }, status: 'COMPLETED' } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, total: { $sum: '$amount' } } },
      { $sort: { _id: 1 } }
    ]);
    res.json({ success: true, data: revenue });
  } catch (error) { next(error); }
});

module.exports = router;
