const Blog = require('../models/Blog');
const User = require('../models/User');

// Get all published blog posts with pagination
const getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const tag = req.query.tag;
    const search = req.query.search;

    let query = { status: 'published' };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (tag) {
      query.tags = { $in: [tag.toLowerCase()] };
    }

    if (search) {
      query.$text = { $search: search };
    }

    const blogs = await Blog.find(query)
      .populate('author', 'name profilePhoto department')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .select('title excerpt author authorName tags category featuredImage createdAt readingTime likes comments');

    const total = await Blog.countDocuments(query);

    res.json({
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

// Get single blog post by ID
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'name profilePhoto department bio')
      .populate('comments.user', 'name profilePhoto');

    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
};

// Create new blog post
const createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, tags, category, featuredImage } = req.body;
    const authorId = req.user.id;

    const user = await User.findById(authorId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const blog = new Blog({
      title,
      content,
      excerpt,
      tags: tags ? tags.split(',').map(tag => tag.trim().toLowerCase()) : [],
      category: category || 'article',
      featuredImage,
      author: authorId,
      authorName: user.name
    });

    await blog.save();

    const populatedBlog = await Blog.findById(blog._id)
      .populate('author', 'name profilePhoto department');

    res.status(201).json(populatedBlog);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
};

// Update blog post
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, tags, category, featuredImage, status } = req.body;
    const userId = req.user.id;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    // Check if user is the author
    if (blog.author.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this blog post' });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (tags) updateData.tags = tags.split(',').map(tag => tag.trim().toLowerCase());
    if (category) updateData.category = category;
    if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
    if (status) updateData.status = status;

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true })
      .populate('author', 'name profilePhoto department');

    res.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ error: 'Failed to update blog post' });
  }
};

// Delete blog post
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    // Check if user is the author
    if (blog.author.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this blog post' });
    }

    await Blog.findByIdAndDelete(id);
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
};

// Get user's blog posts
const getUserBlogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const blogs = await Blog.find({ author: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .select('title excerpt tags category status createdAt views likes comments');

    const total = await Blog.countDocuments({ author: userId });

    res.json({
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    res.status(500).json({ error: 'Failed to fetch user blogs' });
  }
};

// Like/Unlike blog post
const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const existingLike = blog.likes.find(like => like.user.toString() === userId);

    if (existingLike) {
      // Unlike
      blog.likes = blog.likes.filter(like => like.user.toString() !== userId);
    } else {
      // Like
      blog.likes.push({ user: userId });
    }

    await blog.save();

    res.json({
      liked: !existingLike,
      likeCount: blog.likes.length
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
};

// Add comment to blog post
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    blog.comments.push({
      user: userId,
      userName: user.name,
      content: content.trim()
    });

    await blog.save();

    const newComment = blog.comments[blog.comments.length - 1];
    await Blog.populate(newComment, { path: 'user', select: 'name profilePhoto' });

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

// Get popular tags
const getTags = async (req, res) => {
  try {
    const tags = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.json(tags.map(tag => ({ name: tag._id, count: tag.count })));
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
};

module.exports = {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getUserBlogs,
  toggleLike,
  addComment,
  getTags
};