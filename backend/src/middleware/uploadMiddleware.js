const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');

const createUploader = (destinationPath, fieldName) => {
  const fullPath = path.join(__dirname, '..', '..', destinationPath);
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

// Cloudinary upload function for profile images
const uploadToCloudinary = (buffer, folder = 'profile_images') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
    uploadStream.end(buffer);
  });
};

// Middleware for profile image upload using Cloudinary
const uploadProfileImage = (req, res, next) => {
  const upload = multer({ storage: multer.memoryStorage() }).single('profilePicture');

  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: 'File upload error' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    try {
      const secureUrl = await uploadToCloudinary(req.file.buffer);
      req.file.cloudinaryUrl = secureUrl;
      next();
    } catch (error) {
      return res.status(500).json({ error: 'Cloudinary upload failed' });
    }
  });
};

// Specific uploaders for different types
const upload = {
  single: (fieldName) => createUploader('uploads/materials', fieldName)
};

module.exports = { upload, createUploader, uploadProfileImage };