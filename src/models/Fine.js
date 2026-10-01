const mongoose = require('mongoose');
const { FINE_STATUS } = require('../config/constants');

const fineSchema = new mongoose.Schema({
  fineId: { type: String, required: true, unique: true },
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  issue: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue' },
  reason: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  paidAmount: { type: Number, default: 0, min: 0 },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: Object.values(FINE_STATUS), default: FINE_STATUS.PENDING },
  paymentMethod: String,
  collectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: String
}, { timestamps: true });

fineSchema.index({ member: 1, status: 1 });
module.exports = mongoose.model('Fine', fineSchema);
