const mongoose = require('mongoose');

const electricSchema = new mongoose.Schema({
  customerNo: { type: String, required: true, unique: true }, // auto-generate
  houseNo: { type: String, unique: true, required: true },
  electricType: { type: String, enum: ['Saacad', 'Group', 'Freazer'], required: true },
  statusElectric: { type: String, enum: ['Active', 'Inactive', 'Free Charge'], required: true },
  meterNo: { type: String, unique: true, required: true },
   
}, { timestamps: true });

module.exports = mongoose.model('Electric', electricSchema);
