const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/dashboard/dashboardcontroller');

// Route untuk mendapatkan data dashboard
router.get('/data', dashboardController.getDashboardData);

module.exports = router;