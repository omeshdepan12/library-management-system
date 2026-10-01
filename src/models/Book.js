const mongoose = require('mongoose');
const { BOOK_STATUS } = require('../config/constants');

const bookSchema = new mongoose.Schema({
  bookId: { type: String, required: true, unique: true, trim: true, uppercase: true },
  isbn: { type: String, required: true, unique: true, trim: true },
  bookName: { type: String, required: true, trim: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
  publisher: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher' },
  edition: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  language: String,
  subject: String,
  publicationYear: Number,
  price: { type: Number, min: 0 },
  quantity: { type: Number, required: true, min: 0 },
  availableQuantity: { type: Number, required: true, min: 0 },
  shelfNumber: String,
  rackNumber: String,
  location: String,
  status: { type: String, enum: Object.values(BOOK_STATUS), default: BOOK_STATUS.AVAILABLE },
  cover: String,
  description: String,
  deletedAt: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

bookSchema.index({ isbn: 1 }, { unique: true });
bookSchema.index({ bookId: 1 }, { unique: true });
bookSchema.index({ bookName: 'text', isbn: 'text', subject: 'text' });

module.exports = mongoose.model('Book', bookSchema);
