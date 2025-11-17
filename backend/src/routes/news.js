const express = require('express');
const router = express.Router();
const { getEducationalNews } = require('../controllers/newsController');

// Get educational news relevant to college students
router.get('/educational', getEducationalNews);

module.exports = router;