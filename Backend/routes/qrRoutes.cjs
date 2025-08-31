const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController.cjs');

router.post('/scan', qrController.scanQrCode);

module.exports = router;