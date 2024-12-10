const express = require('express');
const router = express.Router();
const yukBuangController = require('../../controllers/yukbuang/yukBuangController');
const uploadYukBuangPhoto = require('../../middlewares/uploadMiddleware').uploadYukBuangPhoto;

router.get('/', yukBuangController.getAllYukBuang);
router.post('/', uploadYukBuangPhoto, yukBuangController.createYukBuang);
router.delete('/:delivery_id', yukBuangController.deleteYukBuang);
router.put('/:delivery_id', yukBuangController.updateYukBuang);


module.exports = router;