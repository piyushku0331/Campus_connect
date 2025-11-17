const Resource = require('../models/Resource');
const { awardPoints, checkAchievements } = require('./gamificationController');
const getResources = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, tag } = req.query;
    const offset = (page - 1) * limit;
    let query = supabase
      .from('resources')
      .select(`
        *,
        uploader:users(id, full_name, avatar_url)
      `)
      .order('created_at', { ascending: false });
    let countQuery = supabase
      .from('resources')
      .select('*', { count: 'exact', head: true });
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      countQuery = countQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }
    if (tag) {
      query = query.contains('tags', [tag]);
      countQuery = countQuery.contains('tags', [tag]);
    }
    const { count } = await countQuery;
    const { data: resources, error } = await query
      .range(offset, offset + limit - 1);
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch resources' });
    }
    res.json({
      resources,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
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
    const { data: resource, error } = await supabase
      .from('resources')
      .select(`
        *,
        uploader:users(id, full_name, avatar_url)
      `)
      .eq('id', id)
      .single();
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch resource' });
    }
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

    const { data: resource, error } = await supabase
      .from('resources')
      .insert({
        title,
        description,
        file_url: finalFileUrl,
        file_type,
        uploader_id: userId,
        tags: parsedTags
      })
      .select()
      .single();
    if (error) {
      return res.status(500).json({ error: 'Failed to upload resource' });
    }
    await awardPoints(userId, 30, 'uploaded_resource', resource.id);
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
    const { data: existingResource } = await supabase
      .from('resources')
      .select('uploader_id')
      .eq('id', id)
      .single();
    if (!existingResource || existingResource.uploader_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this resource' });
    }
    const { data: resource, error } = await supabase
      .from('resources')
      .update({
        title,
        description,
        tags,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    if (error) {
      return res.status(500).json({ error: 'Failed to update resource' });
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
    const { data: existingResource } = await supabase
      .from('resources')
      .select('uploader_id')
      .eq('id', id)
      .single();
    if (!existingResource || existingResource.uploader_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this resource' });
    }
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id);
    if (error) {
      return res.status(500).json({ error: 'Failed to delete resource' });
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
    let queryBuilder = supabase
      .from('resources')
      .select(`
        *,
        uploader:users(id, full_name, avatar_url)
      `)
      .order('created_at', { ascending: false });
    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
    }
    if (tag) {
      queryBuilder = queryBuilder.contains('tags', [tag]);
    }
    const { data: resources, error } = await queryBuilder.limit(50);
    if (error) {
      return res.status(500).json({ error: 'Failed to search resources' });
    }
    res.json(resources);
  } catch (error) {
    console.error('Error searching resources:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getUserResources = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data: resources, error } = await supabase
      .from('resources')
      .select('*')
      .eq('uploader_id', userId)
      .order('created_at', { ascending: false });
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch user resources' });
    }
    res.json(resources);
  } catch (error) {
    console.error('Error fetching user resources:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const incrementDownloadCount = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: resource, error } = await supabase
      .from('resources')
      .update({
        download_count: supabase.raw('download_count + 1')
      })
      .eq('id', id)
      .select()
      .single();
    if (error) {
      return res.status(500).json({ error: 'Failed to update download count' });
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

