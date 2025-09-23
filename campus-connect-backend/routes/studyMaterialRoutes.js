const express = require('express');
const router = express.Router();
const { uploadMaterial, getMaterials } = require('../controllers/studyMaterialController');
const authMiddleware = require('../middleware/authMiddleware');
const createUploader = require('../middleware/uploadMiddleware');

const materialUploader = createUploader('uploads/materials', 'materialFile');

router.post('/', authMiddleware, materialUploader, uploadMaterial);
router.get('/', getMaterials);

module.exports = router;