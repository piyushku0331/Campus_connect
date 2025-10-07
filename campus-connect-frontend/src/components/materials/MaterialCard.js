import React from 'react';
import { FaDownload, FaFileAlt, FaBook, FaCalendar } from 'react-icons/fa';
import '../../assets/styles/components/material/MaterialCard.css';

const MaterialCard = ({ material }) => {
  const getFileIcon = (filePath) => {
    const extension = filePath.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FaFileAlt className="file-icon pdf" />;
      case 'doc':
      case 'docx':
        return <FaFileAlt className="file-icon doc" />;
      default:
        return <FaFileAlt className="file-icon" />;
    }
  };

  return (
    <div className="material-card">
      <div className="material-header">
        {getFileIcon(material.filePath)}
        <div className="material-meta">
          <h4 className="material-title">{material.title}</h4>
          <div className="material-details">
            <span className="detail-item">
              <FaBook className="detail-icon" />
              {material.subject}
            </span>
            <span className="detail-item">
              <FaCalendar className="detail-icon" />
              Semester {material.semester}
            </span>
          </div>
        </div>
      </div>

      <div className="material-actions">
        <a
          href={`http://localhost:5000/${material.filePath}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-download"
        >
          <FaDownload className="download-icon" />
          Download
        </a>
      </div>
    </div>
  );
};

export default MaterialCard;