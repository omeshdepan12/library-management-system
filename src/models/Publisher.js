const mongoose = require('mongoose');

const publisherSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  address: String,
  contact: String,
  email: String
}, { timestamps: true });

module.exports = mongoose.model('Publisher', publisherSchema);
