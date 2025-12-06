const express = require('express');


const electricController = require('../controllers/electricController');
const router = express.Router();

router.post('/create-electric', electricController.createElectric);
router.get('/all-electric', electricController.getElectric);
// router.delete('/delete-house/:id', houseController.deleteHouse);
// router.put('/update-house/:id', houseController.updateHouse);


module.exports = router;