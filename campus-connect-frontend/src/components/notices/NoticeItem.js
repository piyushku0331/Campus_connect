import React from 'react';
import '../../assets/styles/components/notices/NoticeItem.css';


const NoticeItem = ({ notice }) => {
  
  

  return (
    <div className="notice-item">
      <div className="notice-icon">
        {}
        PDF
      </div>
      <div className="notice-details">
        <h5>{notice.title}</h5>
        <span className="notice-category">{notice.category}</span>
      </div>
      <a 
        href={`http://localhost:5000/${notice.filePath}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="btn-download"
      >
        View
      </a>
    </div>
  );
};

export default NoticeItem;