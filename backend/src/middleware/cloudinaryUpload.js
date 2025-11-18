const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const createCloudinaryStorage = (folder, allowedFormats) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folder,
      allowed_formats: allowedFormats,
      transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
    },
  });
};

const fileFilter = (allowedMimes) => (req, file, cb) => {
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: ${allowedMimes.join(', ')}`), false);
  }
};

const uploadUserProfile = multer({
  storage: createCloudinaryStorage('user_profiles', ['jpeg', 'png', 'webp'], 2 * 1024 * 1024),
  fileFilter: fileFilter(['image/jpeg', 'image/png', 'image/webp']),
  limits: { fileSize: 2 * 1024 * 1024 },
}).single('photo');

const uploadPostMedia = multer({
  storage: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, createCloudinaryStorage('posts/images', ['jpeg', 'png', 'webp'], 10 * 1024 * 1024));
    } else if (file.mimetype.startsWith('video/')) {
      cb(null, createCloudinaryStorage('posts/videos', ['mp4', 'mov', 'avi', 'webm'], 50 * 1024 * 1024));
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'), false);
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB for videos
}).array('media', 10); // Allow up to 10 files

const uploadResourcePDF = multer({
  storage: createCloudinaryStorage('resource_pdfs', ['pdf'], 25 * 1024 * 1024),
  fileFilter: fileFilter(['application/pdf']),
  limits: { fileSize: 25 * 1024 * 1024 },
}).single('resourceFile');

const uploadLostAndFound = multer({
  storage: (req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      cb(null, createCloudinaryStorage('lost_and_found/images', ['jpeg', 'png', 'webp'], 5 * 1024 * 1024));
    } else if (file.mimetype === 'application/pdf') {
      cb(null, createCloudinaryStorage('lost_and_found/documents', ['pdf'], 15 * 1024 * 1024));
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
  limits: { fileSize: 15 * 1024 * 1024 },
}).fields([
  { name: 'itemPhoto', maxCount: 1 },
  { name: 'itemDocument', maxCount: 1 },
]);

module.exports = {
  uploadUserProfile,
  uploadResourcePDF,
  uploadLostAndFound,
  uploadPostMedia,
};