const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({
     customerNo: { type: String, unique: true
  },
    fullname: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    statusPerson: { type: String, enum: ['Single', 'Married'], required: true },
    damiin: { type: String, required: false },
    damiinPhone: { type: String, required: true },
    // required: { type: Number, required: true },
    // paid: { type: Number, required: true },
    // discount: { type: Number, default: 0 },
    // remaining: { type: Number, default: 0 },
    // levelElectric: { type: String, enum: ['Group', 'Watch',], required: true },
    

  
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);