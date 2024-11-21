const express = require('express');
const router = express.Router();
const yukBuangController = require('../../controllers/yukbuang/yukBuangController');

router.get('/', yukBuangController.getAllYukBuang);
router.post('/', yukBuangController.createYukBuang);
router.delete('/:delivery_id', yukBuangController.deleteYukBuang);
router.put('/:delivery_id', yukBuangController.updateYukBuang);


module.exports = router;