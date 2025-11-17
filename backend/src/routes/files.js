const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Route to serve files from GridFS
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid file ID' });
    }

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads'
    });

    // Find the file
    const files = await bucket.find({ _id: new mongoose.Types.ObjectId(id) }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const file = files[0];

    // Set appropriate headers
    res.set({
      'Content-Type': file.contentType || 'application/octet-stream',
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Cache-Control': 'public, max-age=31536000' // Cache for 1 year
    });

    // Stream the file
    const downloadStream = bucket.openDownloadStream(file._id);
    downloadStream.pipe(res);

    downloadStream.on('error', (error) => {
      console.error('Error streaming file:', error);
      res.status(500).json({ error: 'Error streaming file' });
    });

  } catch (error) {
    console.error('Error serving file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;