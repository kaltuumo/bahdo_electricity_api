const mongoose = require('mongoose');

const areaSchema = new mongoose.Schema({
  areaName: { type: String, required: true },
  description: { type: String, required: true },
  zoneName: { type: String, required: true }, // ✅ zone name

}, { timestamps: true });

module.exports = mongoose.model('Area', areaSchema);