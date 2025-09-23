const Helpline = require('../models/Helpline');
const logger = require('../config/winston');

// @desc    Get all helpline contacts
// @route   GET /api/helpline
// @access  Public
exports.getAllHelplines = async (req, res) => {
  try {
    const helplines = await Helpline.find().sort({ category: 1, serviceName: 1 });
    res.json(helplines);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Add a new helpline contact
// @route   POST /api/helpline
// @access  Admin
exports.addHelpline = async (req, res) => {
  try {
    const newHelpline = new Helpline({ ...req.body });
    const helpline = await newHelpline.save();
    res.status(201).json(helpline);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a helpline contact
// @route   PUT /api/helpline/:id
// @access  Admin
exports.updateHelpline = async (req, res) => {
  try {
    const helpline = await Helpline.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!helpline) {
      return res.status(404).json({ msg: 'Helpline contact not found' });
    }
    res.json(helpline);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a helpline contact
// @route   DELETE /api/helpline/:id
// @access  Admin
exports.deleteHelpline = async (req, res) => {
  try {
    const helpline = await Helpline.findByIdAndDelete(req.params.id);
    if (!helpline) {
      return res.status(404).json({ msg: 'Helpline contact not found' });
    }
    res.json({ msg: 'Helpline contact removed' });
  } catch (err) {
    logger.error(err.message);
    res.status(500).send('Server Error');
  }
};