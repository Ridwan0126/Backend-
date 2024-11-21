const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pointExchangeController = require('../../controllers/kuypoint/pointExchangeController');

const receiptStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/receipts/'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const uploadReceipt = multer({ storage: receiptStorage });

router.get('/history', pointExchangeController.getAll);
router.post('/history', pointExchangeController.create);
router.put('/history/:id', pointExchangeController.update);
router.delete('/history/:id', pointExchangeController.delete);
router.post('/history/:id/receipt', uploadReceipt.single('receipt'), pointExchangeController.uploadReceipt);

module.exports = router;