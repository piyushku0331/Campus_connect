import React, { useState } from 'react';
import NoticeItem from '../components/notices/NoticeItem';
import '../assets/styles/pages/NoticeBoardPage.css';

const NoticeBoardPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  
  const notices = [
    { _id: 1, title: 'Mid-Term Exam Schedule', category: 'Exams', filePath: 'uploads/file1.pdf' },
    { _id: 2, title: 'Merit Scholarship Announcement', category: 'Scholarships', filePath: 'uploads/file2.pdf' },
    { _id: 3, title: 'Semester V Results', category: 'Results', filePath: 'uploads/file3.png' },
  ];

  const filteredNotices = activeFilter === 'All' ? notices : notices.filter(n => n.category === activeFilter);

  return (
    <div className="notice-board-page">
      <div className="page-header">
        <h1>Notice Board</h1>
      </div>
      <div className="notice-filters">
        <button
          className={activeFilter === 'All' ? 'active' : ''}
          onClick={() => setActiveFilter('All')}
        >
          All
        </button>
        <button
          className={activeFilter === 'Exams' ? 'active' : ''}
          onClick={() => setActiveFilter('Exams')}
        >
          Exams
        </button>
        <button
          className={activeFilter === 'Results' ? 'active' : ''}
          onClick={() => setActiveFilter('Results')}
        >
          Results
        </button>
        <button
          className={activeFilter === 'Scholarships' ? 'active' : ''}
          onClick={() => setActiveFilter('Scholarships')}
        >
          Scholarships
        </button>
      </div>
      <div className="notice-list">
        {filteredNotices.map(n => <NoticeItem key={n._id} notice={n} />)}
      </div>
    </div>
  );
};

export default NoticeBoardPage;