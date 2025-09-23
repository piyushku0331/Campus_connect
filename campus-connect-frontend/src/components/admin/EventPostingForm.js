import React, { useState } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaTag, FaFileAlt } from 'react-icons/fa';
import { eventsAPI } from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';

const EventPostingForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    campus: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useNotification();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await eventsAPI.createEvent(formData);
      showSuccess('Event posted successfully!');
      setFormData({
        title: '',
        description: '',
        date: '',
        campus: '',
        category: ''
      });
    } catch (err) {
      showError(err.message || 'Failed to post event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Post New Event</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label htmlFor="title">
            <FaFileAlt className="input-icon-small" />
            Event Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter event title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Describe the event..."
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">
              <FaCalendarAlt className="input-icon-small" />
              Date & Time
            </label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="campus">
              <FaMapMarkerAlt className="input-icon-small" />
              Campus
            </label>
            <select
              id="campus"
              name="campus"
              value={formData.campus}
              onChange={handleChange}
              required
            >
              <option value="">Select Campus</option>
              <option value="Main Campus">Main Campus</option>
              <option value="North Campus">North Campus</option>
              <option value="South Campus">South Campus</option>
            </select>
          </div>
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
            <option value="Sports">Sports</option>
            <option value="Cultural">Cultural</option>
            <option value="Technical">Technical</option>
            <option value="Social">Social</option>
            <option value="Career">Career</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Posting Event...' : 'Post Event'}
        </button>
      </form>
    </div>
  );
};

export default EventPostingForm;