const Notice = require('../models/Notice');
const logger = require('../config/winston');

// @desc    Upload a new notice
// @route   POST /api/notices
// @access  Admin
exports.uploadNotice = async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!req.file) {
      return res.status(400).json({ msg: 'Please upload a file' });
    }
    const newNotice = new Notice({
      title,
      category,
      filePath: req.file.path,
    });
    const notice = await newNotice.save();
    res.status(201).json(notice);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all notices with filtering
// @route   GET /api/notices
// @access  Public
exports.getNotices = async (req, res) => {
  try {
    const { category } = req.query;
    const query = {};
    if (category) {
      query.category = category;
    }
    const notices = await Notice.find(query).sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send('Server Error');
  }
};