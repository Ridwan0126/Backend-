const express = require('express');
const router = express.Router();
const messageController = require('../../controllers/message/messageController');

// Dapatkan semua pesan untuk pengguna
router.get('/:userId/messages', messageController.getMessages);

// Kirim pesan baru berdasarkan permintaan pickup
router.post('/send', messageController.sendMessage);

// Pembaruan status dan kirim pesan pembaruan
router.put('/update-status', messageController.updatePickupStatusAndNotify);

module.exports = router;