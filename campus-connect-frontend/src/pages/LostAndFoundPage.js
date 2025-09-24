import React, { useState, useEffect } from 'react';
import LostItemCard from '../components/lostandfound/LostItemCard';
import { lostItemsAPI } from '../services/api';
import '../assets/styles/pages/LostAndFoundPage.css';

const LostAndFoundPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showReportForm, setShowReportForm] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    location: '',
    status: 'Lost',
    category: 'Other'
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await lostItemsAPI.getLostItems();
      setItems(data);
    } catch (err) {
      setError('Failed to load items');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const submitData = new FormData();
      submitData.append('itemName', formData.itemName);
      submitData.append('description', formData.description);
      submitData.append('location', formData.location);
      submitData.append('category', formData.category);
      submitData.append('status', formData.status);
      if (selectedFile) {
        submitData.append('itemImage', selectedFile);
      }

      await lostItemsAPI.createLostItem(submitData);
      setShowReportForm(false);
      setFormData({
        itemName: '',
        description: '',
        location: '',
        status: 'Lost',
        category: 'Other'
      });
      setSelectedFile(null);
      fetchItems(); // Refresh the list
    } catch (err) {
      setError('Failed to report item. Please try again.');
      console.error('Error submitting item:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const isLoggedIn = !!localStorage.getItem('token');

  const filteredItems = items.filter(item => {
    const matchesTab = activeTab === 'all' ||
                      (activeTab === 'lost' && item.status === 'Lost') ||
                      (activeTab === 'found' && item.status === 'Found');

    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const lostCount = items.filter(item => item.status === 'Lost').length;
  const foundCount = items.filter(item => item.status === 'Found').length;

  return (
    <div className="lost-found-page">
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Lost & Found</h1>
            <p>Help reunite lost items with their owners</p>
          </div>
          {isLoggedIn && (
            <button
              className="btn-report"
              onClick={() => setShowReportForm(!showReportForm)}
            >
              {showReportForm ? 'Cancel' : 'Report an Item'}
            </button>
          )}
        </div>
      </div>

      {showReportForm && (
        <div className="report-form-container">
          <div className="report-form">
            <h3>Report {formData.status} Item</h3>
            {error && <div className="error-message">{error}</div>}
            {!isLoggedIn && (
              <div className="auth-message">
                Please <a href="/login">login</a> to report an item.
              </div>
            )}
            {isLoggedIn && (
              <form className="form-grid" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Item Name *</label>
                  <input
                    type="text"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleInputChange}
                    placeholder="e.g., Laptop, ID Card, Water Bottle"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Documents">Documents</option>
                    <option value="Books">Books</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Personal Items">Personal Items</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Lost">Lost</option>
                    <option value="Found">Found</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Provide detailed description, brand, color, distinguishing features..."
                    rows="3"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Location {formData.status} *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Library, Classroom 201"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Item Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowReportForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <div className="filters-section">
        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Items ({items.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'lost' ? 'active' : ''}`}
            onClick={() => setActiveTab('lost')}
          >
            Lost Items ({lostCount})
          </button>
          <button
            className={`tab-btn ${activeTab === 'found' ? 'active' : ''}`}
            onClick={() => setActiveTab('found')}
          >
            Found Items ({foundCount})
          </button>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search items, locations, descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="items-section">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner">Loading items...</div>
          </div>
        ) : error ? (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h3>Error loading items</h3>
            <p>{error}</p>
            <button className="btn-primary" onClick={fetchItems}>
              Try Again
            </button>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="items-grid">
            {filteredItems.map(item => (
              <LostItemCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No items found</h3>
            <p>
              {searchTerm
                ? `No items match your search "${searchTerm}"`
                : `No ${activeTab === 'all' ? '' : activeTab} items reported yet`
              }
            </p>
            <button className="btn-primary" onClick={() => setShowReportForm(true)}>
              Report First Item
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LostAndFoundPage;