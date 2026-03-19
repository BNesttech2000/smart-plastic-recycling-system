// server/src/middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Ensure upload directories exist
const uploadDirs = [
  path.join(__dirname, '../../uploads'),
  path.join(__dirname, '../../uploads/contributions'),
  path.join(__dirname, '../../uploads/profiles'),
  path.join(__dirname, '../../uploads/temp')
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = path.join(__dirname, '../../uploads/temp');
    
    if (req.baseUrl.includes('contributions')) {
      uploadPath = path.join(__dirname, '../../uploads/contributions');
    } else if (req.baseUrl.includes('profile')) {
      uploadPath = path.join(__dirname, '../../uploads/profiles');
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `img-${uniqueSuffix}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Max 5 files
  },
  fileFilter: fileFilter
});

// Image optimization middleware
const optimizeImages = async (req, res, next) => {
  if (!req.files && !req.file) {
    return next();
  }

  try {
    const files = req.files || (req.file ? [req.file] : []);
    
    for (const file of files) {
      const outputPath = file.path.replace('/temp/', '/optimized/');
      const outputDir = path.dirname(outputPath);
      
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Optimize image
      await sharp(file.path)
        .resize(1200, 1200, { // Max dimensions
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
        .toFile(outputPath);

      // Remove original file
      fs.unlinkSync(file.path);

      // Update file path
      file.path = outputPath;
      file.filename = path.basename(outputPath);
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Clean up temporary files on error
const cleanupTempFiles = (err, req, res, next) => {
  if (req.files) {
    req.files.forEach(file => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });
  } else if (req.file) {
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
  next(err);
};

module.exports = {
  upload,
  optimizeImages,
  cleanupTempFiles
};