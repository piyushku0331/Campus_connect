const StudyMaterial = require('../models/StudyMaterial');
const logger = require('../utils/logger');

const uploadMaterial = async (req, res) => {
  try {
    const { title, subject, semester, university } = req.body;

    if (!title || !subject || !semester || !university) {
      return res.status(400).json({ error: 'Title, subject, semester, and university are required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a file' });
    }

    const newMaterial = new StudyMaterial({
      title: title.trim(),
      subject: subject.trim(),
      semester: semester.trim(),
      university: university.trim(),
      filePath: req.file.path,
      uploader: req.user.id
    });

    const material = await newMaterial.save();
    await material.populate('uploader', 'name email');
    res.status(201).json({ material });
  } catch (err) {
    logger.error('Upload material error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', details: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getMaterials = async (req, res) => {
  try {
    const { subject, semester, university, page = 1, limit = 10 } = req.query;
    const query = {};

    if (subject) query.subject = new RegExp(subject, 'i');
    if (semester) query.semester = semester;
    if (university) query.university = new RegExp(university, 'i');

    const materials = await StudyMaterial.find(query)
      .populate('uploader', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await StudyMaterial.countDocuments(query);

    res.status(200).json({
      materials,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    logger.error('Get materials error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await StudyMaterial.findById(id).populate('uploader', 'name email');

    if (!material) {
      return res.status(404).json({ error: 'Study material not found' });
    }

    res.status(200).json({ material });
  } catch (err) {
    logger.error('Get material by ID error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid material ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Trim string fields
    Object.keys(updates).forEach(key => {
      if (typeof updates[key] === 'string') {
        updates[key] = updates[key].trim();
      }
    });

    const material = await StudyMaterial.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
      .populate('uploader', 'name email');

    if (!material) {
      return res.status(404).json({ error: 'Study material not found' });
    }

    // Check if user owns the material or is admin
    if (material.uploader._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this material' });
    }

    res.status(200).json({ material });
  } catch (err) {
    logger.error('Update material error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', details: err.message });
    }
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid material ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await StudyMaterial.findById(id);

    if (!material) {
      return res.status(404).json({ error: 'Study material not found' });
    }

    // Check if user owns the material or is admin
    if (material.uploader.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this material' });
    }

    await StudyMaterial.findByIdAndDelete(id);

    // TODO: Remove file from filesystem
    // fs.unlinkSync(path.join(__dirname, '..', material.filePath));

    res.status(200).json({ message: 'Study material deleted successfully' });
  } catch (err) {
    logger.error('Delete material error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid material ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  uploadMaterial,
  getMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial
};