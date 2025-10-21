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
    const { page = 1, limit = 20, subject, semester, search, user_id } = req.query;
    const offset = (page - 1) * limit;
    let query = supabase
      .from('notes')
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
    if (subject && subject !== 'All') {
      query = query.eq('subject', subject);
    }
    if (semester && semester !== 'All') {
      query = query.eq('semester', semester);
    }
    if (user_id) {
      query = query.eq('user_id', user_id);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }
    const { data, error, count } = await query;
    if (error) throw error;
    res.json({
      notes: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('notes')
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
      return res.status(404).json({ error: 'Note not found' });
    }
    await supabase
      .from('notes')
      .update({ downloads_count: data.downloads_count + 1 })
      .eq('id', id);
    res.json(data);
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, subject, semester, file_url, file_type, file_size, tags } = req.body;
    if (!title || !subject || !semester) {
      return res.status(400).json({ error: 'Title, subject, and semester are required' });
    }
    const { data, error } = await supabase
      .from('notes')
      .insert({
        user_id: req.user.id,
        title,
        description,
        subject,
        semester,
        file_url,
        file_type,
        file_size,
        tags: tags || []
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
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, subject, semester, tags } = req.body;
    const { data: existingNote, error: fetchError } = await supabase
      .from('notes')
      .select('user_id')
      .eq('id', id)
      .single();
    if (fetchError || !existingNote) {
      return res.status(404).json({ error: 'Note not found' });
    }
    if (existingNote.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this note' });
    }
    const { data, error } = await supabase
      .from('notes')
      .update({
        title,
        description,
        subject,
        semester,
        tags,
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
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { data: existingNote, error: fetchError } = await supabase
      .from('notes')
      .select('user_id, file_url')
      .eq('id', id)
      .single();
    if (fetchError || !existingNote) {
      return res.status(404).json({ error: 'Note not found' });
    }
    if (existingNote.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this note' });
    }
    if (existingNote.file_url) {
      const filePath = existingNote.file_url.split('/').pop();
      await supabase.storage
        .from('notes')
        .remove([filePath]);
    }
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);
    if (error) throw error;
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
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
      .eq('note_id', id)
      .single();
    if (existingLike) {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('id', existingLike.id);
      if (error) throw error;
      res.json({ liked: false, message: 'Note unliked' });
    } else {
      const { error } = await supabase
        .from('likes')
        .insert({
          user_id: userId,
          note_id: id
        });
      if (error) throw error;
      res.json({ liked: true, message: 'Note liked' });
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
      .eq('note_id', id)
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
        note_id: id,
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
      .eq('note_id', id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});
router.get('/meta/subjects', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('subject')
      .not('subject', 'is', null);
    if (error) throw error;
    const subjects = [...new Set(data.map(item => item.subject))].sort();
    res.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});
router.get('/meta/semesters', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('semester')
      .not('semester', 'is', null);
    if (error) throw error;
    const semesters = [...new Set(data.map(item => item.semester))].sort();
    res.json(semesters);
  } catch (error) {
    console.error('Error fetching semesters:', error);
    res.status(500).json({ error: 'Failed to fetch semesters' });
  }
});
module.exports = router;
