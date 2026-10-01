const mongoose = require('mongoose');
const { PAYMENT_STATUS } = require('../config/constants');

const paymentSchema = new mongoose.Schema({
  paymentId: { type: String, required: true, unique: true },
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  amount: { type: Number, required: true, min: 0 },
  paymentType: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  date: { type: Date, default: Date.now },
  receiptNumber: { type: String, required: true, unique: true },
  collectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: Object.values(PAYMENT_STATUS), default: PAYMENT_STATUS.COMPLETED },
  reference: String,
  notes: String
}, { timestamps: true });

paymentSchema.index({ member: 1, date: -1 });
module.exports = mongoose.model('Payment', paymentSchema);
