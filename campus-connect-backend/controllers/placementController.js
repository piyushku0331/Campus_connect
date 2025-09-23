const Placement = require('../models/Placement');
const logger = require('../config/winston');

// @desc    Post a new placement result
// @route   POST /api/placements
// @access  Admin
exports.postPlacement = async (req, res) => {
  try {
    const newPlacement = new Placement({ ...req.body });
    const placement = await newPlacement.save();
    res.status(201).json(placement);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all placements
// @route   GET /api/placements
// @access  Public
exports.getPlacements = async (req, res) => {
  try {
    const placements = await Placement.find().sort({ year: -1 });
    res.json(placements);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get alumni success stories
// @route   GET /api/placements/success-stories
// @access  Public
exports.getSuccessStories = async (req, res) => {
  try {
    const stories = await Placement.find({ isSuccessStory: true }).sort({ createdAt: -1 });
    res.json(stories);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send('Server Error');
  }
};