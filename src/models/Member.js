const mongoose = require('mongoose');
const { MEMBER_STATUS } = require('../config/constants');

const memberSchema = new mongoose.Schema({
  memberId: { type: String, required: true, unique: true, trim: true, uppercase: true },
  name: { type: String, required: true, trim: true },
  profilePhoto: String,
  mobile: { type: String, required: true, trim: true },
  email: { type: String, lowercase: true, trim: true },
  address: String,
  classOrCourse: String,
  enrollmentNumber: { type: String, trim: true },
  joiningDate: { type: Date, default: Date.now },
  membershipType: { type: String, default: 'STANDARD' },
  membershipExpiry: Date,
  status: { type: String, enum: Object.values(MEMBER_STATUS), default: MEMBER_STATUS.ACTIVE },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deletedAt: Date
}, { timestamps: true });

memberSchema.index({ memberId: 1 }, { unique: true });
memberSchema.index({ email: 1 });
memberSchema.index({ name: 'text', mobile: 'text', enrollmentNumber: 'text' });

module.exports = mongoose.model('Member', memberSchema);
