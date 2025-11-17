const Resource = require('../models/Resource');
const { awardPoints, checkAchievements } = require('./gamificationController');
const getResources = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, tag } = req.query;
    const skip = (page - 1) * limit;

    let query = Resource.find().populate('uploader_id', 'name email avatar_url');
    let countQuery = Resource.find();

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query = query.or([
        { title: searchRegex },
        { description: searchRegex }
      ]);
      countQuery = countQuery.or([
        { title: searchRegex },
        { description: searchRegex }
      ]);
    }

    if (tag) {
      query = query.where('tags').in([tag]);
      countQuery = countQuery.where('tags').in([tag]);
    }

    const total = await countQuery.countDocuments();
    const resources = await query
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      resources,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await Resource.findById(id).populate('uploader_id', 'name email avatar_url');

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.json(resource);
  } catch (error) {
    console.error('Error fetching resource by ID:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid resource ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
const uploadResource = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, file_url, file_type, tags } = req.body;
    let finalFileUrl = file_url;

    // If a file was uploaded, use the uploaded file URL
    if (req.file) {
      finalFileUrl = `/uploads/materials/${req.file.filename}`;
    }

    // Parse tags if it's a string
    let parsedTags = tags;
    if (typeof tags === 'string') {
      try {
        parsedTags = JSON.parse(tags);
      } catch (e) {
        // If JSON parsing fails, treat as comma-separated string
        parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      }
    }

    const resource = new Resource({
      title,
      description,
      file_url: finalFileUrl,
      file_type,
      uploader_id: userId,
      tags: parsedTags
    });

    await resource.save();
    await resource.populate('uploader_id', 'name email avatar_url');

    await awardPoints(userId, 30, 'uploaded_resource', resource._id);
    await checkAchievements(userId);

    res.status(201).json(resource);
  } catch (error) {
    console.error('Error uploading resource:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', details: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, description, tags } = req.body;

    const existingResource = await Resource.findById(id);
    if (!existingResource || existingResource.uploader_id.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this resource' });
    }

    const resource = await Resource.findByIdAndUpdate(
      id,
      { title, description, tags },
      { new: true, runValidators: true }
    ).populate('uploader_id', 'name email avatar_url');

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.json(resource);
  } catch (error) {
    console.error('Error updating resource:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', details: error.message });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid resource ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existingResource = await Resource.findById(id);
    if (!existingResource || existingResource.uploader_id.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this resource' });
    }

    await Resource.findByIdAndDelete(id);
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid resource ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
const searchResources = async (req, res) => {
  try {
    const { query, tag } = req.query;
    let searchQuery = Resource.find().populate('uploader_id', 'name email avatar_url');

    if (query) {
      const searchRegex = new RegExp(query, 'i');
      searchQuery = searchQuery.or([
        { title: searchRegex },
        { description: searchRegex }
      ]);
    }

    if (tag) {
      searchQuery = searchQuery.where('tags').in([tag]);
    }

    const resources = await searchQuery
      .sort({ created_at: -1 })
      .limit(50);

    res.json(resources);
  } catch (error) {
    console.error('Error searching resources:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getUserResources = async (req, res) => {
  try {
    const userId = req.user.id;
    const resources = await Resource.find({ uploader_id: userId })
      .sort({ created_at: -1 });

    res.json(resources);
  } catch (error) {
    console.error('Error fetching user resources:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const incrementDownloadCount = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await Resource.findByIdAndUpdate(
      id,
      { $inc: { download_count: 1 } },
      { new: true, runValidators: true }
    ).populate('uploader_id', 'name email avatar_url');

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    if (resource.download_count % 10 === 0 && resource.download_count > 0) {
      await awardPoints(resource.uploader_id._id || resource.uploader_id, 50, 'resource_download_milestone', id);
    } else {
      await awardPoints(resource.uploader_id._id || resource.uploader_id, 5, 'resource_downloaded', id);
    }

    res.json(resource);
  } catch (error) {
    console.error('Error incrementing download count:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid resource ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = {
  getResources,
  getResourceById,
  uploadResource,
  updateResource,
  deleteResource,
  searchResources,
  getUserResources,
  incrementDownloadCount
};
