import React, { useState } from 'react';
import LostItemCard from '../components/lostandfound/LostItemCard';
import '../assets/styles/pages/LostAndFoundPage.css';

const LostAndFoundPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showReportForm, setShowReportForm] = useState(false);

  // Enhanced mock data - replace with API calls
  const items = [
    {
      _id: 1,
      itemName: 'Student ID Card',
      description: 'Red student ID card found near the library entrance. Contact details visible.',
      status: 'Found',
      location: 'Library Entrance',
      date: '2024-01-15',
      category: 'Documents',
      contactInfo: 'library@campus.edu'
    },
    {
      _id: 2,
      itemName: 'Dell Laptop Charger',
      description: 'Black Dell laptop charger with USB-C connector. Found in classroom 201.',
      status: 'Found',
      location: 'Classroom 201',
      date: '2024-01-14',
      category: 'Electronics',
      contactInfo: 'security@campus.edu'
    },
    {
      _id: 3,
      itemName: 'Blue Water Bottle',
      description: 'Hydro Flask water bottle, blue color. Lost during sports practice.',
      status: 'Lost',
      location: 'Sports Ground',
      date: '2024-01-13',
      category: 'Personal Items',
      contactInfo: 'john.doe@student.campus.edu'
    },
    {
      _id: 4,
      itemName: 'Mathematics Textbook',
      description: 'Calculus textbook by James Stewart. Missing from study room.',
      status: 'Lost',
      location: 'Study Room A',
      date: '2024-01-12',
      category: 'Books',
      contactInfo: 'sarah.smith@student.campus.edu'
    },
    {
      _id: 5,
      itemName: 'Wireless Earbuds',
      description: 'Sony WF-1000XM4 earbuds found in cafeteria. Still in original case.',
      status: 'Found',
      location: 'Cafeteria',
      date: '2024-01-11',
      category: 'Electronics',
      contactInfo: 'cafeteria@campus.edu'
    }
  ];

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
          <button
            className="btn-report"
            onClick={() => setShowReportForm(!showReportForm)}
          >
            {showReportForm ? 'Cancel' : 'Report an Item'}
          </button>
        </div>
      </div>

      {showReportForm && (
        <div className="report-form-container">
          <div className="report-form">
            <h3>Report {activeTab === 'lost' ? 'Lost' : 'Found'} Item</h3>
            <form className="form-grid">
              <div className="form-group">
                <label>Item Name *</label>
                <input type="text" placeholder="e.g., Laptop, ID Card, Water Bottle" required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select>
                  <option value="">Select category</option>
                  <option value="electronics">Electronics</option>
                  <option value="documents">Documents</option>
                  <option value="books">Books</option>
                  <option value="clothing">Clothing</option>
                  <option value="personal">Personal Items</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label>Description *</label>
                <textarea
                  placeholder="Provide detailed description, brand, color, distinguishing features..."
                  rows="3"
                  required
                />
              </div>
              <div className="form-group">
                <label>Location {activeTab === 'lost' ? 'Lost' : 'Found'} *</label>
                <input type="text" placeholder="e.g., Library, Classroom 201" required />
              </div>
              <div className="form-group">
                <label>Date {activeTab === 'lost' ? 'Lost' : 'Found'}</label>
                <input type="date" />
              </div>
              <div className="form-group full-width">
                <label>Contact Information *</label>
                <input type="email" placeholder="Your email or phone number" required />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowReportForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Submit Report
                </button>
              </div>
            </form>
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
        {filteredItems.length > 0 ? (
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