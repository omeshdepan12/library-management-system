const mongoose = require('mongoose');
const { ROLES, MEMBER_STATUS } = require('../config/constants');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: Object.values(ROLES), required: true, default: ROLES.STAFF },
  permissions: [{ type: String }],
  phone: { type: String, trim: true },
  photo: String,
  department: String,
  status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
  isOwner: { type: Boolean, default: false, immutable: true },
  twoFactorEnabled: { type: Boolean, default: false },
  failedLoginAttempts: { type: Number, default: 0 },
  lockedUntil: Date,
  lastLoginAt: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

userSchema.index({ email: 1 }, { unique: true });
userSchema.pre('save', function protectOwner(next) {
  if (!this.isNew && this.isOwner && (this.isModified('role') || this.isModified('status') || this.isModified('isOwner'))) {
    return next(new Error('Owner account role, status, and ownership cannot be changed'));
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
