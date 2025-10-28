const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createUploader = (destinationPath, fieldName) => {
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
    limits: { fileSize: 10000000 },
    fileFilter: (req, file, cb) => {
      cb(null, true);
    }
  });

  return upload.single(fieldName);
};

module.exports = createUploader;