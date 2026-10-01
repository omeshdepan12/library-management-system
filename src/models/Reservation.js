const mongoose = require('mongoose');
const { RESERVATION_STATUS } = require('../config/constants');

const reservationSchema = new mongoose.Schema({
  reservationId: { type: String, required: true, unique: true },
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  reservationDate: { type: Date, default: Date.now },
  queuePosition: { type: Number, required: true, min: 1 },
  status: { type: String, enum: Object.values(RESERVATION_STATUS), default: RESERVATION_STATUS.PENDING },
  expiryDate: Date,
  notifiedAt: Date
}, { timestamps: true });

reservationSchema.index({ book: 1, status: 1, queuePosition: 1 });
module.exports = mongoose.model('Reservation', reservationSchema);
