const express = require('express');


const houseController = require('../controllers/houseController');
const router = express.Router();

router.post('/create-house', houseController.createHouse);
router.get('/all-house', houseController.getHouse);
router.delete('/delete-house/:id', houseController.deleteHouse);
router.put('/update-house/:id', houseController.updateHouse);


module.exports = router;