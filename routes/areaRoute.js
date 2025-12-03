const express = require('express');


const areaController = require('../controllers/areaController');
const router = express.Router();

router.post('/create-area', areaController.createArea);
router.get('/all-area', areaController.getArea);
router.put('/update-area/:id', areaController.updateArea);
router.delete('/delete-area/:id', areaController.deleteArea);


module.exports = router;