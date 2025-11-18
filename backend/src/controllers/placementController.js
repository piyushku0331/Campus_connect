const Placement = require('../models/Placement');
const logger = require('../utils/logger');

const postPlacement = async (req, res) => {
  try {
    const { studentName, company, role, year, isSuccessStory, story } = req.body;

    if (!studentName || !company || !role || !year) {
      return res.status(400).json({ error: 'Student name, company, role, and year are required' });
    }

    const newPlacement = new Placement({
      studentName: studentName.trim(),
      company: company.trim(),
      role: role.trim(),
      year: parseInt(year),
      isSuccessStory: isSuccessStory || false,
      story: story?.trim()
    });

    const placement = await newPlacement.save();
    res.status(201).json({ placement });
  } catch (err) {
    logger.error('Post placement error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', details: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPlacements = async (req, res) => {
  try {
    const { year, company, page = 1, limit = 10 } = req.query;
    const query = {};

    if (year) query.year = parseInt(year);
    if (company) query.company = new RegExp(company, 'i');

    const placements = await Placement.find(query)
      .sort({ year: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Placement.countDocuments(query);

    res.status(200).json({
      placements,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    logger.error('Get placements error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getSuccessStories = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const stories = await Placement.find({ isSuccessStory: true })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Placement.countDocuments({ isSuccessStory: true });

    res.status(200).json({
      stories,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    logger.error('Get success stories error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updatePlacement = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Trim string fields
    Object.keys(updates).forEach(key => {
      if (typeof updates[key] === 'string') {
        updates[key] = updates[key].trim();
      }
    });

    if (updates.year) {
      updates.year = parseInt(updates.year);
    }

    const placement = await Placement.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!placement) {
      return res.status(404).json({ error: 'Placement not found' });
    }

    res.status(200).json({ placement });
  } catch (err) {
    logger.error('Update placement error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', details: err.message });
    }
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid placement ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deletePlacement = async (req, res) => {
  try {
    const { id } = req.params;
    const placement = await Placement.findByIdAndDelete(id);

    if (!placement) {
      return res.status(404).json({ error: 'Placement not found' });
    }

    res.status(200).json({ message: 'Placement deleted successfully' });
  } catch (err) {
    logger.error('Delete placement error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid placement ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  postPlacement,
  getPlacements,
  getSuccessStories,
  updatePlacement,
  deletePlacement
};