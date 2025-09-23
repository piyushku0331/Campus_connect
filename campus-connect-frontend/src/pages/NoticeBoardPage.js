import React from 'react';
import NoticeItem from '../components/notices/NoticeItem';
import '../assets/styles/pages/NoticeBoardPage.css';

const NoticeBoardPage = () => {
  // Mock data - replace with API calls
  const notices = [
    { _id: 1, title: 'Mid-Term Exam Schedule', category: 'Exams', filePath: 'uploads/file1.pdf' },
    { _id: 2, title: 'Merit Scholarship Announcement', category: 'Scholarships', filePath: 'uploads/file2.pdf' },
    { _id: 3, title: 'Semester V Results', category: 'Results', filePath: 'uploads/file3.png' },
  ];

  return (
    <div className="notice-board-page">
      <div className="page-header">
        <h1>Notice Board</h1>
      </div>
      <div className="notice-filters">
        <button>All</button>
        <button>Exams</button>
        <button>Results</button>
        <button>Scholarships</button>
      </div>
      <div className="notice-list">
        {notices.map(n => <NoticeItem key={n._id} notice={n} />)}
      </div>
    </div>
  );
};

export default NoticeBoardPage;