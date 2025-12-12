const express = require('express');
const invoiceController = require('../controllers/invoiceController');
const router = express.Router();

router.post('/create-invoice', invoiceController.createInvoice);
router.get('/all-invoice', invoiceController.getInvoice);
router.put('/update-invoice/:id', invoiceController.updateInvoice);
router.delete('/delete-invoice/:id', invoiceController.deleteInvoice);
router.put('/update-status/:id', invoiceController.updateInvoiceStatus);
router.get('/all-pending', invoiceController.getPendingInvoices);
router.get('/unpaid', invoiceController.getUnpaidInvoices);
router.get('/paid', invoiceController.getPaidInvoices);
router.post("/pay/:id", invoiceController.payInvoice);



module.exports = router;