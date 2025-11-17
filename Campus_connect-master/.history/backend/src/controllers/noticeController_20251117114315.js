const Notice = require('../models/Notice');
const logger = require('../utils/logger');

const uploadNotice = async (req, res) => {
  try {
    const { title, category } = req.body;

    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category are required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a file' });
    }

    const newNotice = new Notice({
      title: title.trim(),
      category,
      filePath: req.file.path
    });

    const notice = await newNotice.save();
    res.status(201).json({ notice });
  } catch (err) {
    logger.error('Upload notice error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', details: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getNotices = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }

    const notices = await Notice.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notice.countDocuments(query);

    res.status(200).json({
      notices,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    logger.error('Get notices error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getNoticeById = async (req, res) => {
  try {
    const { id } = req.params;
    const notice = await Notice.findById(id);

    if (!notice) {
      return res.status(404).json({ error: 'Notice not found' });
    }

    res.status(200).json({ notice });
  } catch (err) {
    logger.error('Get notice by ID error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid notice ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const notice = await Notice.findByIdAndDelete(id);

    if (!notice) {
      return res.status(404).json({ error: 'Notice not found' });
    }

    // TODO: Remove file from filesystem
    // fs.unlinkSync(path.join(__dirname, '..', notice.filePath));

    res.status(200).json({ message: 'Notice deleted successfully' });
  } catch (err) {
    logger.error('Delete notice error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid notice ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  uploadNotice,
  getNotices,
  getNoticeById,
  deleteNotice
};