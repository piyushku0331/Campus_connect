const express = require('express');
const router = express.Router();
const {
  uploadMaterial,
  getMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial
} = require('../controllers/studyMaterialController');
const { verifyToken } = require('../middleware/authMiddleware');
const { uploadResourcePDF } = require('../middleware/cloudinaryUpload');

router.post('/', verifyToken, uploadResourcePDF, uploadMaterial);
router.get('/', getMaterials);
router.get('/:id', getMaterialById);
router.put('/:id', verifyToken, updateMaterial);
router.delete('/:id', verifyToken, deleteMaterial);

module.exports = router;