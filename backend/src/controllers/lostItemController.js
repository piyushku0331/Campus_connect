const LostItem = require('../models/LostItem');
const logger = require('../utils/logger');

const reportItem = async (req, res) => {
  try {
    const { itemName, description, location, status, category } = req.body;

    if (!itemName || !description) {
      return res.status(400).json({ error: 'Item name and description are required' });
    }

    const newLostItem = new LostItem({
      itemName: itemName.trim(),
      description: description.trim(),
      location: location?.trim(),
      category: category || 'Other',
      status: status || 'Lost',
      itemPhotoUrl: req.files?.itemPhoto ? req.files.itemPhoto[0].path : null, // Cloudinary URL
      itemDocumentUrl: req.files?.itemDocument ? req.files.itemDocument[0].path : null, // Cloudinary URL
      reporter: req.user.id
    });

    const item = await newLostItem.save();
    await item.populate('reporter', 'name email');
    res.status(201).json({ item });
  } catch (err) {
    logger.error('Report item error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', details: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllItems = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;

    const items = await LostItem.find(query)
      .populate('reporter', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await LostItem.countDocuments(query);

    res.status(200).json({
      items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    logger.error('Get all items error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateItemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Lost', 'Found'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be Lost or Found' });
    }

    const item = await LostItem.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('reporter', 'name email');

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(200).json({ item });
  } catch (err) {
    logger.error('Update item status error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', details: err.message });
    }
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid item ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await LostItem.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Check if user owns the item or is admin
    if (item.reporter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this item' });
    }

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    logger.error('Delete item error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid item ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  reportItem,
  getAllItems,
  updateItemStatus,
  deleteItem
};