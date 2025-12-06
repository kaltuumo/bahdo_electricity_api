const joi = require('joi');
const mongoose = require('mongoose');
exports.userSignupSchema = joi.object({
    fullname: joi.string()
        .min(3)
        .max(100)
        .required(),

    phone: joi.string()
        .pattern(/^[0-9]{9,15}$/)
        .required(),

    email: joi.string()
        .min(6)
        .max(60)
        .required()
        .email({ tlds: { allow: ['com', 'net'] } }),

    password: joi.string()
        .min(6)
        .max(100)
        .required()
        .pattern(new RegExp('^[0-9]{6,100}$')),

    // 🔥 ROLE FIELD ADDED
    role: joi.string()
        .valid("Admin", "Manager", "User")
        .required() ,  // Haddii aad rabto optional iga sii sheeg

    status: joi.string()
        .valid("Active", "Inactive", "Banned")
        .required()   // Haddii aad rabto optional iga sii sheeg
});


exports.userLoginSchema = joi.object({
    email: joi.string()
    .min(6)
    .max(60)
    .required()
    .email({
        tlds: { allow: ['com', 'net'] }
    }),
    // Password: only numbers allowed
    password: joi.string()
    .required()
    .pattern(new RegExp('^[0-9]{6,100}$')) // Only numeric characters
});

exports.customerSignupSchema = joi.object({
    customerNo: joi.string().optional(),
    fullname: joi.string().min(3).max(100).required(),
    phone: joi.string()
        .pattern(/^[0-9]{9,15}$/)
        .required(),
    gender: joi.string().valid('Male', 'Female').required(),
    // required: joi.number().min(0).required(),
    // paid: joi.number().min(0).required(),
    // discount: joi.number().min(0).optional(), // Add this line to allow discount
    // remaining: joi.number().min(0).optional(), // Add this line to allow remaining
    statusPerson: joi.string().valid('Single', 'Married').required(),
    damiin: joi.string().optional(),
     damiinPhone: joi.string()
        .pattern(/^[0-9]{9,15}$/)
        .required(),
    

});

exports.zoneSignupSchema = joi.object({
  zoneName: joi.string().min(1).max(100).required(),
  description: joi.string().min(1).max(500).required(),
});

exports.areaSignupSchema = joi.object({
  areaName: joi.string().min(1).max(100).required(),
  description: joi.string().min(1).max(500).required(),
  zoneName: joi.string().min(1).max(100).required(), // ✅ zone name
});




exports.houseSignupSchema = joi.object({
  fullname: joi.string().min(1).max(100).required(),
  phone: joi.string().min(1).max(50).required(),
  zoneName: joi.string().min(1).max(100).required(), 
  areaName: joi.string().min(1).max(100).required(),
  city: joi.string().min(1).max(100).required(),
//   customerNo: joi.string().min(1).max(50).required(),
});

exports.electricSignupSchema  = joi.object({
    electricType: joi.string().valid('Saacad', 'Group', 'Freazer').required(),
    statusElectric: joi.string().valid('Active', 'Inactive', 'Free Charge').required(),
});

exports.invoiceSignupSchema = joi.object({
  fullname: joi.string().min(1).max(100).required(),
  phone: joi.string().min(1).max(50).required(),
  zone: joi.string().min(1).max(50).required(),
  area: joi.string().min(1).max(50).required(),
  beforeRead: joi.number().required(),
  afterRead: joi.number().required(),
  kwhUsed: joi.number().required(),
  discount: joi.number().default(0),
  month: joi.string().required(),
  status: joi.string().valid('Paid', 'Unpaid', 'Pending').default('Unpaid'),
  houseNo: joi.string().allow('', null),
  watchNo: joi.string().allow('', null),
  totalAmount: joi.number().optional(),

  // ✅ Payments
  required: joi.number().min(0).optional(),
  paid: joi.number().min(0).optional(),
  remaining: joi.number().min(0).optional(),
  amountPaid: joi.number().default(0)
});



// exports.paymentSignupSchema = joi.object({
//   fullname: joi.string().min(3).max(100).required(),
//   totalAmount: joi.number().min(0).required(),
//   discount: joi.number().min(0).default(0),
//   amountPaid: joi.number().min(0).default(0),
//   paymentMethod: joi
//     .string()
//     .valid('Cash', 'Mobile Money', 'Bank Transfer')
//     .default('Cash'),
//   paymentDate: joi.date().optional(),
// });

// You can add more schemas as needed for other entities like Area, House, etc.

