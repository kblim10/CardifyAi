const express = require('express');
const router = express.Router();
const { processImage, processDocument } = require('../controllers/ocr');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.post('/image', protect, upload.single('image'), processImage);
router.post('/document', protect, upload.single('document'), processDocument);

module.exports = router; 