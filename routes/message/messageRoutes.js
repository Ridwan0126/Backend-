const express = require('express');
const router = express.Router();
const messageController = require('../../controllers/message/messageController');

router.get('/admin/messages', messageController.getMessagesForAdmin);
router.post('/send', messageController.sendMessage);
router.put('/update-status', messageController.updatePickupStatusAndNotify);
router.put('/mark-as-read/:messageId', messageController.markAsRead);

module.exports = router;