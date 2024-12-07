const express = require('express');
const router = express.Router();
const messageController = require('../../controllers/message/messageController');

// Dapatkan semua pesan yang ditujukan untuk admin
router.get('/admin/messages', messageController.getMessagesForAdmin);

// Kirim pesan baru berdasarkan permintaan pickup
router.post('/send', messageController.sendMessage);

// Pembaruan status dan kirim pesan pembaruan
router.put('/update-status', messageController.updatePickupStatusAndNotify);

module.exports = router;