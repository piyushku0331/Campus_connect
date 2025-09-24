const Helpline = require('../models/Helpline');
const logger = require('../config/winston');




exports.getAllHelplines = async (req, res) => {
  try {
    const helplines = await Helpline.find().sort({ category: 1, serviceName: 1 });
    res.json(helplines);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send('Server Error');
  }
};




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