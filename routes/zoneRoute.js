const express = require('express');


const zoneController = require('../controllers/zoneController');
const router = express.Router();

router.post('/create-zone', zoneController.createZone);
router.get('/all-zone', zoneController.getZone);
router.put('/update-zone/:id', zoneController.updateZone);
router.delete('/delete-zone/:id', zoneController.deleteZone);


module.exports = router;