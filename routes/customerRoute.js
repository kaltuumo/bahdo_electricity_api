const express = require('express');


const customerController = require('../controllers/customerController');
const router = express.Router();

router.post('/create-customer', customerController.createCustomer);
// router.post('/add-discount', customerController.AddDiscount);

router.get('/all-customer', customerController.getCustomer);
// router.get('/get-pending', customerController.getPendingCustomer);
router.delete('/delete-customer/:id', customerController.deleteCustomer);
router.put('/update-customer/:id', customerController.updateCustomer);
// router.put('/update-discount/:id', customerController.updateDiscount);

// router.get('/statistics', customerController.getCustomerStatistics);  // Use the controller method


module.exports = router;