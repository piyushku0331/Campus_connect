const LostItem = require('../models/LostItem');
const logger = require('../config/winston');


exports.reportItem = async (req, res) => {
  try {
    const { itemName, description, location, status, category } = req.body;
    const newLostItem = new LostItem({
      itemName,
      description,
      location,
      category,
      status,
      imagePath: req.file ? req.file.path : null, 
      reporter: req.user.id,
    });
    const item = await newLostItem.save();
    res.status(201).json(item);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send('Server Error');
  }
};


exports.getAllItems = async (req, res) => {
  try {
    const items = await LostItem.find()
      .populate('reporter', 'name')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send('Server Error');
  }
};