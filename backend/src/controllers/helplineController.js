const Helpline = require('../models/Helpline');
const logger = require('../utils/logger');

const getAllHelplines = async (req, res) => {
  try {
    const helplines = await Helpline.find().sort({ category: 1, serviceName: 1 });
    res.status(200).json({ helplines });
  } catch (err) {
    logger.error('Get all helplines error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const addHelpline = async (req, res) => {
  try {
    const { serviceName, contactPerson, phoneNumber, email, category } = req.body;

    if (!serviceName || !phoneNumber || !category) {
      return res.status(400).json({ error: 'Service name, phone number, and category are required' });
    }

    const newHelpline = new Helpline({
      serviceName: serviceName.trim(),
      contactPerson: contactPerson?.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email?.trim(),
      category
    });

    const helpline = await newHelpline.save();
    res.status(201).json({ helpline });
  } catch (err) {
    logger.error('Add helpline error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', details: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateHelpline = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Trim string fields
    Object.keys(updates).forEach(key => {
      if (typeof updates[key] === 'string') {
        updates[key] = updates[key].trim();
      }
    });

    const helpline = await Helpline.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!helpline) {
      return res.status(404).json({ error: 'Helpline contact not found' });
    }
    res.status(200).json({ helpline });
  } catch (err) {
    logger.error('Update helpline error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', details: err.message });
    }
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid helpline ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteHelpline = async (req, res) => {
  try {
    const { id } = req.params;
    const helpline = await Helpline.findByIdAndDelete(id);
    if (!helpline) {
      return res.status(404).json({ error: 'Helpline contact not found' });
    }
    res.status(200).json({ message: 'Helpline contact removed successfully' });
  } catch (err) {
    logger.error('Delete helpline error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid helpline ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllHelplines,
  addHelpline,
  updateHelpline,
  deleteHelpline
};