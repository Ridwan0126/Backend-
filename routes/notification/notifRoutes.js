const express = require('express');
const router = express.Router();
const notifController = require('../../controllers/notification/notifController');

router.get('/notifications', notifController.getPendingRequests); 
module.exports = router;
