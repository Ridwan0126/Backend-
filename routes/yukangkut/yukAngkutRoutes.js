const express = require('express');
const router = express.Router();
const yukAngkutController = require('../../controllers/yukangkut/yukAngkutController');
const uploadYukAngkutPhoto = require('../../middlewares/uploadMiddleware').uploadYukAngkutPhoto;

router.get('/', yukAngkutController.getAllYukAngkut);
router.post('/', uploadYukAngkutPhoto, yukAngkutController.createYukAngkut);  // Menambahkan middleware upload
router.put('/:pickup_id', yukAngkutController.updateYukAngkut);
router.delete('/:pickup_id', yukAngkutController.deleteYukAngkut);

module.exports = router;
