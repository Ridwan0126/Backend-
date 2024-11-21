const express = require('express');
const router = express.Router();
const yukAngkutController = require('../../controllers/yukangkut/yukAngkutController');

router.get('/', yukAngkutController.getAllYukAngkut);
router.post('/', yukAngkutController.createYukAngkut);
router.put('/:pickup_id', yukAngkutController.updateYukAngkut);
router.delete('/:pickup_id', yukAngkutController.deleteYukAngkut);

module.exports = router;