const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, type, user_id } = req.query;
    const offset = (page - 1) * limit;
    let query = supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (
          name,
          avatar_url,
          department
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (type) {
      query = query.eq('type', type);
    }
    if (user_id) {
      query = query.eq('user_id', user_id);
    }
    const { data, error, count } = await query;
    if (error) throw error;
    res.json({
      posts: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (
          name,
          avatar_url,
          department
        )
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});
router.post('/', verifyToken, async (req, res) => {
  try {
    const { content, type, title, metadata } = req.body;
    if (!content || !type) {
      return res.status(400).json({ error: 'Content and type are required' });
    }
    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: req.user.id,
        content,
        type,
        title,
        metadata: metadata || {}
      })
      .select(`
        *,
        profiles:user_id (
          name,
          avatar_url,
          department
        )
      `)
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { content, title, metadata } = req.body;
    const { data: existingPost, error: fetchError } = await supabase
      .from('posts')
      .select('user_id')
      .eq('id', id)
      .single();
    if (fetchError || !existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (existingPost.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }
    const { data, error } = await supabase
      .from('posts')
      .update({
        content,
        title,
        metadata,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        profiles:user_id (
          name,
          avatar_url,
          department
        )
      `)
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { data: existingPost, error: fetchError } = await supabase
      .from('posts')
      .select('user_id')
      .eq('id', id)
      .single();
    if (fetchError || !existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (existingPost.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);
    if (error) throw error;
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});
router.post('/:id/like', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { data: existingLike, error: likeError } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', userId)
      .eq('post_id', id)
      .single();
    if (existingLike) {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('id', existingLike.id);
      if (error) throw error;
      res.json({ liked: false, message: 'Post unliked' });
    } else {
      const { error } = await supabase
        .from('likes')
        .insert({
          user_id: userId,
          post_id: id
        });
      if (error) throw error;
      res.json({ liked: true, message: 'Post liked' });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});
router.get('/:id/likes', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('likes')
      .select(`
        id,
        created_at,
        profiles:user_id (
          name,
          avatar_url
        )
      `)
      .eq('post_id', id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching likes:', error);
    res.status(500).json({ error: 'Failed to fetch likes' });
  }
});
router.post('/:id/comments', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Comment content is required' });
    }
    const { data, error } = await supabase
      .from('comments')
      .insert({
        user_id: req.user.id,
        post_id: id,
        content
      })
      .select(`
        *,
        profiles:user_id (
          name,
          avatar_url
        )
      `)
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});
router.get('/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles:user_id (
          name,
          avatar_url
        )
      `)
      .eq('post_id', id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});
module.exports = router;
