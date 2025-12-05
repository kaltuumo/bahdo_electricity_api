const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
  customerNo: { type: String, required: true, unique: true }, // auto-generate
  fullname: { type: String, required: true },
  phone: { type: String, required: true },
  zoneName: { type: String, required: true },
  areaName: { type: String, required: true },
  city: { type: String, required: true },
  houseNo: { type: String, unique: true, required: true },
  watchNo: { type: String, unique: true, required: true },
}, { timestamps: true });

module.exports = mongoose.model('House', houseSchema);
