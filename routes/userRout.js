const express = require('express');

const userController = require('../controllers/userController');
const router = express.Router();
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/logout', userController.logout);


router.get('/all-user', userController.getUser);
// router.put('/update-admin/:id', adminController.updateAdmin);
router.delete('/delete-user/:id', userController.deleteUser);
module.exports = router;