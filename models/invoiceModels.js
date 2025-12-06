const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  billNo: { type: Number },
  fullname: { type: String, required: true },
  phone: { type: String, required: true },
  zone: { type: String, required: true },
  area: { type: String, required: true },
  beforeRead: { type: Number, required: true },
  afterRead: { type: Number, required: true },
  kwhUsed: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  month: { type: String, required: true },
  status: { type: String, enum: ['Paid', 'Unpaid', 'Pending'], default: 'Unpaid' },
  houseNo: { type: String },
  watchNo: { type: String },
  totalAmount: { type: Number },

  // 💰 Payments
  amountPaid: { type: Number, default: 0 },
  required: { type: Number, default: 0 },
  paid: { type: Number, default: 0 },
  remaining: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);