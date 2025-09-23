import React from 'react';
import '../../assets/styles/components/lostandfound/LostItemCard.css';

const LostItemCard = ({ item }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    return status === 'Found' ? 'var(--success-color)' : 'var(--warning-color)';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Electronics': '📱',
      'Documents': '📄',
      'Books': '📚',
      'Clothing': '👕',
      'Personal Items': '👜',
      'Other': '📦'
    };
    return icons[category] || '📦';
  };

  return (
    <div className={`lost-item-card ${item.status.toLowerCase()}`}>
      <div className="card-header">
        <div className="status-badge" style={{ backgroundColor: getStatusColor(item.status) }}>
          {item.status}
        </div>
        <div className="category-icon">
          {getCategoryIcon(item.category)}
        </div>
      </div>

      <div className="card-content">
        <h3 className="item-title">{item.itemName}</h3>
        <p className="item-description">{item.description}</p>

        <div className="item-details">
          <div className="detail-item">
            <span className="detail-icon">📍</span>
            <span className="detail-text">{item.location}</span>
          </div>

          {item.date && (
            <div className="detail-item">
              <span className="detail-icon">📅</span>
              <span className="detail-text">{formatDate(item.date)}</span>
            </div>
          )}

          {item.category && (
            <div className="detail-item">
              <span className="detail-icon">🏷️</span>
              <span className="detail-text">{item.category}</span>
            </div>
          )}
        </div>
      </div>

      <div className="card-footer">
        <div className="contact-info">
          <span className="contact-label">Contact:</span>
          <span className="contact-value">{item.contactInfo}</span>
        </div>
        <button className="btn-contact">
          {item.status === 'Found' ? 'Claim Item' : 'I Found It'}
        </button>
      </div>
    </div>
  );
};

export default LostItemCard;