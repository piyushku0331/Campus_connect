const Resource = require('../models/Resource');
const { awardPoints, checkAchievements } = require('./gamificationController');
const getResources = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, tag } = req.query;
    const offset = (page - 1) * limit;
    let query = {};
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }
    if (tag) {
      query.tags = { $in: [tag] };
    }
    const total = await Resource.countDocuments(query);
    const resources = await Resource.find(query)
      .populate('uploader_id', 'id full_name avatar_url')
      .sort({ created_at: -1 })
      .skip(offset)
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
    const resource = await Resource.findById(id).populate('uploader_id', 'id full_name avatar_url');
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.json(resource);
  } catch (error) {
    console.error('Error fetching resource by ID:', error);
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
    await awardPoints(userId, 30, 'uploaded_resource', resource._id);
    await checkAchievements(userId);
    res.status(201).json(resource);
  } catch (error) {
    console.error('Error uploading resource:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, description, tags } = req.body;
    const resource = await Resource.findOneAndUpdate(
      { _id: id, uploader_id: userId },
      {
        title,
        description,
        tags,
        updated_at: new Date()
      },
      { new: true }
    );
    if (!resource) {
      return res.status(403).json({ error: 'Not authorized to update this resource' });
    }
    res.json(resource);
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const resource = await Resource.findOneAndDelete({ _id: id, uploader_id: userId });
    if (!resource) {
      return res.status(403).json({ error: 'Not authorized to delete this resource' });
    }
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const searchResources = async (req, res) => {
  try {
    const { query, tag } = req.query;
    let searchQuery = {};
    if (query) {
      searchQuery.$or = [
        { title: new RegExp(query, 'i') },
        { description: new RegExp(query, 'i') }
      ];
    }
    if (tag) {
      searchQuery.tags = { $in: [tag] };
    }
    const resources = await Resource.find(searchQuery)
      .populate('uploader_id', 'id full_name avatar_url')
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
    const resources = await Resource.find({ uploader_id: userId }).sort({ created_at: -1 });
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
      { new: true }
    );
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    if (resource.download_count % 10 === 0 && resource.download_count > 0) {
      await awardPoints(resource.uploader_id, 50, 'resource_download_milestone', id);
    } else {
      await awardPoints(resource.uploader_id, 5, 'resource_downloaded', id);
    }
    res.json(resource);
  } catch (error) {
    console.error('Error incrementing download count:', error);
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
