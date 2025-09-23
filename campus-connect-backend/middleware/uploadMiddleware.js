const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Factory function to create multer upload middleware
const createUploader = (destinationPath, fieldName) => {
  // Ensure the destination directory exists
  const fullPath = path.join(__dirname, '..', destinationPath);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, fullPath);
    },
    filename: (req, file, cb) => {
      cb(null, fieldName + '-' + Date.now() + path.extname(file.originalname));
    }
  });

  const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB limit
    fileFilter: (req, file, cb) => {
      // Allow any file type for now, can be restricted if needed
      cb(null, true);
    }
  });

  return upload.single(fieldName);
};

module.exports = createUploader;