const mongoose = require('mongoose');
const { ISSUE_STATUS } = require('../config/constants');

const issueSchema = new mongoose.Schema({
  issueId: { type: String, required: true, unique: true },
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: Date,
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  returnedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: Object.values(ISSUE_STATUS), default: ISSUE_STATUS.ACTIVE },
  lateDays: { type: Number, default: 0, min: 0 },
  fine: { type: Number, default: 0, min: 0 },
  bookCondition: String,
  damageOrLost: { type: Boolean, default: false },
  notes: String
}, { timestamps: true });

issueSchema.index({ member: 1, status: 1 });
issueSchema.index({ book: 1, status: 1 });
issueSchema.index({ dueDate: 1, status: 1 });

module.exports = mongoose.model('Issue', issueSchema);
