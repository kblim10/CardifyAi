const { createWorker } = require('tesseract.js');
const fs = require('fs');
const path = require('path');

// @desc    Process image for OCR
// @route   POST /api/ocr/image
// @access  Private
exports.processImage = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Mohon upload gambar',
      });
    }

    const filePath = req.file.path;

    // Initialize tesseract worker
    const worker = await createWorker('ind');

    // Recognize text
    const { data } = await worker.recognize(filePath);
    
    // Terminate worker
    await worker.terminate();

    // Delete file after processing
    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      data: {
        text: data.text,
        confidence: data.confidence,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Gagal memproses gambar',
    });
  }
};

// @desc    Process document for OCR
// @route   POST /api/ocr/document
// @access  Private
exports.processDocument = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Mohon upload dokumen',
      });
    }

    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();

    if (fileExt !== '.pdf') {
      // Delete file if not PDF
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        error: 'Hanya file PDF yang didukung',
      });
    }

    // In a real app, you would process PDF pages here
    // For now, we'll just return a placeholder response
    
    // Delete file after processing
    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      data: {
        text: 'Konten PDF akan diproses di sini',
        pageCount: 1,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Gagal memproses dokumen',
    });
  }
}; 