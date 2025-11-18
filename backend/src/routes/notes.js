const express = require('express');
const jwt = require('jsonwebtoken');
const { config } = require('../config');
const User = require('../models/User');
const Note = require('../models/Note');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const router = express.Router();

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = { id: user._id };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, subject, semester, search, user_id } = req.query;
    const skip = (page - 1) * parseInt(limit);

    let query = { };
    if (subject && subject !== 'All') {
      query.subject = subject;
    }
    if (semester && semester !== 'All') {
      query.semester = semester;
    }
    if (user_id) {
      query.user_id = user_id;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const [notes, total] = await Promise.all([
      Note.find(query)
        .populate('user_id', 'name avatar_url department')
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Note.countDocuments(query)
    ]);

    const formattedNotes = notes.map(note => ({
      id: note._id,
      title: note.title,
      description: note.description,
      subject: note.subject,
      semester: note.semester,
      file_url: note.file_url,
      file_type: note.file_type,
      file_size: note.file_size,
      tags: note.tags,
      downloads_count: note.downloads_count,
      created_at: note.created_at,
      updated_at: note.updated_at,
      profiles: {
        name: note.user_id.name,
        avatar_url: note.user_id.avatar_url,
        department: note.user_id.department
      }
    }));

    res.json({
      notes: formattedNotes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
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
    const note = await Note.findById(id).populate('user_id', 'name avatar_url department');
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }


    note.downloads_count += 1;
    await note.save();

    const formattedNote = {
      id: note._id,
      title: note.title,
      description: note.description,
      subject: note.subject,
      semester: note.semester,
      file_url: note.file_url,
      file_type: note.file_type,
      file_size: note.file_size,
      tags: note.tags,
      downloads_count: note.downloads_count,
      created_at: note.created_at,
      updated_at: note.updated_at,
      profiles: {
        name: note.user_id.name,
        avatar_url: note.user_id.avatar_url,
        department: note.user_id.department
      }
    };

    res.json(formattedNote);
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

    const note = new Note({
      user_id: req.user.id,
      title,
      description,
      subject,
      semester,
      file_url,
      file_type,
      file_size,
      tags: tags || []
    });

    await note.save();
    await note.populate('user_id', 'name avatar_url department');

    const formattedNote = {
      id: note._id,
      title: note.title,
      description: note.description,
      subject: note.subject,
      semester: note.semester,
      file_url: note.file_url,
      file_type: note.file_type,
      file_size: note.file_size,
      tags: note.tags,
      downloads_count: note.downloads_count,
      created_at: note.created_at,
      updated_at: note.updated_at,
      profiles: {
        name: note.user_id.name,
        avatar_url: note.user_id.avatar_url,
        department: note.user_id.department
      }
    };

    res.status(201).json(formattedNote);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, subject, semester, tags } = req.body;

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    if (note.user_id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this note' });
    }

    note.title = title || note.title;
    note.description = description || note.description;
    note.subject = subject || note.subject;
    note.semester = semester || note.semester;
    note.tags = tags || note.tags;

    await note.save();
    await note.populate('user_id', 'name avatar_url department');

    const formattedNote = {
      id: note._id,
      title: note.title,
      description: note.description,
      subject: note.subject,
      semester: note.semester,
      file_url: note.file_url,
      file_type: note.file_type,
      file_size: note.file_size,
      tags: note.tags,
      downloads_count: note.downloads_count,
      created_at: note.created_at,
      updated_at: note.updated_at,
      profiles: {
        name: note.user_id.name,
        avatar_url: note.user_id.avatar_url,
        department: note.user_id.department
      }
    };

    res.json(formattedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    if (note.user_id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this note' });
    }



    await Note.findByIdAndDelete(id);

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

    const existingLike = await Like.findOne({ user_id: userId, note_id: id });
    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      res.json({ liked: false, message: 'Note unliked' });
    } else {
      const like = new Like({
        user_id: userId,
        note_id: id
      });
      await like.save();
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
    const likes = await Like.find({ note_id: id })
      .populate('user_id', 'name avatar_url')
      .sort({ created_at: -1 });

    const formattedLikes = likes.map(like => ({
      id: like._id,
      created_at: like.created_at,
      profiles: {
        name: like.user_id.name,
        avatar_url: like.user_id.avatar_url
      }
    }));

    res.json(formattedLikes);
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

    const comment = new Comment({
      user_id: req.user.id,
      note_id: id,
      content
    });

    await comment.save();
    await comment.populate('user_id', 'name avatar_url');

    const formattedComment = {
      id: comment._id,
      content: comment.content,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
      profiles: {
        name: comment.user_id.name,
        avatar_url: comment.user_id.avatar_url
      }
    };

    res.status(201).json(formattedComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});
router.get('/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * parseInt(limit);

    const comments = await Comment.find({ note_id: id })
      .populate('user_id', 'name avatar_url')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const formattedComments = comments.map(comment => ({
      id: comment._id,
      content: comment.content,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
      profiles: {
        name: comment.user_id.name,
        avatar_url: comment.user_id.avatar_url
      }
    }));

    res.json(formattedComments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});
router.get('/meta/subjects', async (req, res) => {
  try {
    const subjects = await Note.distinct('subject');
    res.json(subjects.filter(s => s).sort());
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});
router.get('/meta/semesters', async (req, res) => {
  try {
    const semesters = await Note.distinct('semester');
    res.json(semesters.filter(s => s).sort());
  } catch (error) {
    console.error('Error fetching semesters:', error);
    res.status(500).json({ error: 'Failed to fetch semesters' });
  }
});
module.exports = router;
