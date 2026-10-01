const express = require('express');
const Book = require('../models/Book');
const { permissionMiddleware } = require('../middleware/auth');
const { PERMISSIONS, BOOK_STATUS } = require('../config/constants');

const router = express.Router();
const parsePage = (value, fallback) => Math.max(Number.parseInt(value, 10) || fallback, 1);

router.get('/', permissionMiddleware([PERMISSIONS.VIEW_BOOKS]), async (req, res, next) => {
  try {
    const page = parsePage(req.query.page, 1);
    const limit = Math.min(parsePage(req.query.limit, 20), 100);
    const filter = { deletedAt: null };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) {
      const expression = new RegExp(req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ bookId: expression }, { isbn: expression }, { bookName: expression }, { subject: expression }];
    }
    const [data, total] = await Promise.all([
      Book.find(filter).populate('author publisher category').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Book.countDocuments(filter)
    ]);
    res.json({ success: true, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
});

router.get('/:id', permissionMiddleware([PERMISSIONS.VIEW_BOOKS]), async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, deletedAt: null }).populate('author publisher category');
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
    res.json({ success: true, data: book });
  } catch (error) { next(error); }
});

router.post('/', permissionMiddleware([PERMISSIONS.CREATE_BOOK]), async (req, res, next) => {
  try {
    const { bookId, isbn, bookName, quantity, availableQuantity, ...rest } = req.body;
    if (!bookId || !isbn || !bookName || quantity === undefined) return res.status(400).json({ success: false, message: 'bookId, isbn, bookName and quantity are required' });
    const numericQuantity = Number(quantity);
    if (!Number.isInteger(numericQuantity) || numericQuantity < 0) return res.status(400).json({ success: false, message: 'quantity must be a non-negative integer' });
    const book = await Book.create({ bookId, isbn, bookName, quantity: numericQuantity, availableQuantity: availableQuantity === undefined ? numericQuantity : Number(availableQuantity), status: numericQuantity ? BOOK_STATUS.AVAILABLE : BOOK_STATUS.MAINTENANCE, createdBy: req.user._id, ...rest });
    res.status(201).json({ success: true, data: book });
  } catch (error) { next(error); }
});

router.patch('/:id', permissionMiddleware([PERMISSIONS.EDIT_BOOK]), async (req, res, next) => {
  try {
    const blocked = ['_id', 'createdBy', 'deletedAt'];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => !blocked.includes(key)));
    updates.updatedBy = req.user._id;
    const book = await Book.findOneAndUpdate({ _id: req.params.id, deletedAt: null }, { $set: updates }, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
    res.json({ success: true, data: book });
  } catch (error) { next(error); }
});

router.delete('/:id', permissionMiddleware([PERMISSIONS.DELETE_BOOK]), async (req, res, next) => {
  try {
    const book = await Book.findOneAndUpdate({ _id: req.params.id, deletedAt: null }, { $set: { deletedAt: new Date(), updatedBy: req.user._id } }, { new: true });
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
    res.json({ success: true, message: 'Book moved to recycle state' });
  } catch (error) { next(error); }
});

module.exports = router;
