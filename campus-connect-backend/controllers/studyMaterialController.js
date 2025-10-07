const StudyMaterial = require('../models/StudyMaterials');
const logger = require('../config/winston');


exports.uploadMaterial = async (req, res) => {
  try {
    const { title, subject, semester, university } = req.body;
    if (!req.file) {
      return res.status(400).json({ msg: 'Please upload a file' });
    }
    const newMaterial = new StudyMaterial({
      title,
      subject,
      semester,
      university,
      filePath: req.file.path,
      uploader: req.user.id,
    });
    const material = await newMaterial.save();
    res.status(201).json(material);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send('Server Error');
  }
};


exports.getMaterials = async (req, res) => {
  try {
    const { subject, semester, university } = req.query;
    const query = {};
    if (subject) query.subject = new RegExp(subject, 'i'); 
    if (semester) query.semester = semester;
    if (university) query.university = new RegExp(university, 'i');
    
    const materials = await StudyMaterial.find(query)
      .populate('uploader', 'name')
      .sort({ createdAt: -1 });
    res.json(materials);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send('Server Error');
  }
};