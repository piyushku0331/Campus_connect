import React, { useState } from 'react';
import { Upload, Search, Filter, FileText, Download, Eye, Heart, MessageCircle, Share } from 'lucide-react';
const Notes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const subjects = ['All', 'Data Structures', 'Algorithms', 'Database Systems', 'Operating Systems', 'Computer Networks', 'Web Development'];
  const semesters = ['All', 'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'];
  const notes = [
    {
      id: 1,
      title: 'Binary Trees and BST Operations',
      subject: 'Data Structures',
      semester: 'Semester 3',
      author: 'Priya Sharma',
      department: 'CSE',
      description: 'Comprehensive notes on Binary Trees, BST operations, traversals, and implementation examples in C++.',
      fileType: 'PDF',
      fileSize: '2.4 MB',
      downloads: 45,
      likes: 23,
      comments: 8,
      uploadDate: '2 days ago',
      tags: ['Trees', 'BST', 'C++', 'Algorithms']
    },
    {
      id: 2,
      title: 'Database Normalization Tutorial',
      subject: 'Database Systems',
      semester: 'Semester 4',
      author: 'Rahul Kumar',
      department: 'CSE',
      description: 'Step-by-step guide to database normalization with examples and practice problems.',
      fileType: 'PPT',
      fileSize: '5.1 MB',
      downloads: 67,
      likes: 34,
      comments: 12,
      uploadDate: '1 week ago',
      tags: ['Normalization', 'SQL', 'Database Design']
    },
    {
      id: 3,
      title: 'TCP/IP Protocol Suite',
      subject: 'Computer Networks',
      semester: 'Semester 5',
      author: 'Ankit Gupta',
      department: 'CSE',
      description: 'Detailed explanation of TCP/IP protocols, layers, and network communication.',
      fileType: 'PDF',
      fileSize: '3.2 MB',
      downloads: 89,
      likes: 45,
      comments: 15,
      uploadDate: '3 days ago',
      tags: ['TCP/IP', 'Networking', 'Protocols']
    }
  ];
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === 'All' || note.subject === selectedSubject;
    const matchesSemester = selectedSemester === 'All' || note.semester === selectedSemester;
    return matchesSearch && matchesSubject && matchesSemester;
  });
  return (
    <div className="max-w-7xl mx-auto p-6 animate-fade-in">
      {}
      <div className="flex justify-between items-center mb-8 animate-slide-down">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Notes Hub</h1>
          <p className="text-gray-600 dark:text-gray-400">Share and discover study materials from your peers</p>
        </div>
        <button className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl group">
          <Upload size={20} className="group-hover:scale-110 transition-transform duration-300" />
          Upload Notes
        </button>
      </div>
      {}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search notes by title, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {semesters.map(semester => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note, index) => (
          <div key={note.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 card-hover p-6 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="flex items-start gap-4 mb-4">
              <div className="text-3xl">📚</div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {note.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span className="font-medium">{note.author}</span>
                  <span>•</span>
                  <span>{note.department}</span>
                  <span>•</span>
                  <span>{note.uploadDate}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                    {note.subject}
                  </span>
                  <span className="px-2 py-1 bg-secondary/10 text-secondary rounded-full text-xs">
                    {note.semester}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">
                    {note.fileType}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">
              {note.description}
            </p>
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span>{note.fileSize}</span>
              <span>{note.downloads} downloads</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                <Heart size={16} />
                {note.likes}
              </button>
              <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                <MessageCircle size={16} />
                {note.comments}
              </button>
              <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
                <Share size={16} />
                Share
              </button>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 btn-secondary flex items-center justify-center gap-2">
                <Eye size={16} />
                Preview
              </button>
              <button className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                <Download size={16} />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <FileText size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No notes found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};
export default Notes;
