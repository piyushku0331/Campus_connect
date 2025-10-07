import React, { useState } from 'react';
import { FaFileUpload, FaTag, FaFileAlt } from 'react-icons/fa';
import { noticesAPI } from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';

const NoticeUploadForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    file: null
  });
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useNotification();

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      setFormData({
        ...formData,
        file: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.file) {
      showError('Please select a file to upload');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('file', formData.file);

      await noticesAPI.createNotice(formDataToSend);
      showSuccess('Notice uploaded successfully!');
      setFormData({
        title: '',
        category: '',
        file: null
      });
      // Reset file input
      document.getElementById('file').value = '';
    } catch (err) {
      showError(err.message || 'Failed to upload notice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Upload Notice</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label htmlFor="title">
            <FaFileAlt className="input-icon-small" />
            Notice Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter notice title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">
            <FaTag className="input-icon-small" />
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Academic">Academic</option>
            <option value="Administrative">Administrative</option>
            <option value="Events">Events</option>
            <option value="Examinations">Examinations</option>
            <option value="General">General</option>
            <option value="Scholarships">Scholarships</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="file">
            <FaFileUpload className="input-icon-small" />
            Upload File
          </label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleChange}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            required
            className="file-input"
          />
          <small className="file-hint">
            Supported formats: PDF, DOC, DOCX, JPG, PNG (Max: 10MB)
          </small>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Notice'}
        </button>
      </form>
    </div>
  );
};

export default NoticeUploadForm;