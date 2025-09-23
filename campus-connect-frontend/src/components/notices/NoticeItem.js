import React from 'react';
import '../../assets/styles/components/notices/NoticeItem.css';
// import { FaFilePdf, FaImage } from 'react-icons/fa';

const NoticeItem = ({ notice }) => {
  // const isPdf = notice.filePath.endsWith('.pdf');
  // const API_URL = 'http://localhost:5000'; // Your backend URL

  return (
    <div className="notice-item">
      <div className="notice-icon">
        {/* {isPdf ? <FaFilePdf /> : <FaImage />} */}
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