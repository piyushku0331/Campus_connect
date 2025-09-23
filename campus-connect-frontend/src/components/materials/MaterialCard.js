import React from 'react';
import '../../assets/styles/components/material/MaterialCard.css';

const MaterialCard = ({ material }) => {
  return (
    <div className="material-card">
      <h4>{material.title}</h4>
      <p><strong>Subject:</strong> {material.subject}</p>
      <p><strong>Semester:</strong> {material.semester}</p>
      <a href={`http://localhost:5000/${material.filePath}`} target="_blank" rel="noopener noreferrer" className="btn-download">
        Download
      </a>
    </div>
  );
};

export default MaterialCard;