import React, { useState } from 'react';
import { Search, MapPin, Briefcase, GraduationCap, MessageCircle, UserPlus, Filter } from 'lucide-react';
const Alumni = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const batches = ['All', '2024', '2023', '2022', '2021', '2020', '2019', '2018'];
  const companies = ['All', 'Google', 'Microsoft', 'Amazon', 'Meta', 'Adobe', 'Netflix', 'Apple', 'Tesla'];
  const alumni = [
    {
      id: 1,
      name: 'Ankit Gupta',
      batch: '2020',
      department: 'CSE',
      company: 'Google',
      position: 'Software Engineer',
      location: 'Mountain View, CA',
      photo: '/api/placeholder/150/150',
      achievements: ['Google Top Contributor 2023', 'Published 5 research papers', 'Mentored 50+ students'],
      bio: 'Passionate about AI and machine learning. Love mentoring juniors and contributing to open source.',
      linkedin: 'https://linkedin.com/in/ankit-gupta',
      email: 'ankit.gupta@google.com',
      successStory: 'From Chitkara to Google: My journey involved consistent learning, competitive programming, and never giving up on my dreams.'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      batch: '2021',
      department: 'CSE',
      company: 'Microsoft',
      position: 'Product Manager',
      location: 'Seattle, WA',
      photo: '/api/placeholder/150/150',
      achievements: ['Microsoft MVP 2023', 'Led 3 major product launches', 'Women in Tech Advocate'],
      bio: 'Product management enthusiast with a background in software engineering. Always excited to help students navigate their career paths.',
      linkedin: 'https://linkedin.com/in/priya-sharma',
      email: 'priya.sharma@microsoft.com',
      successStory: 'Transitioning from engineering to product management taught me the importance of communication and user empathy.'
    },
    {
      id: 3,
      name: 'Rahul Kumar',
      batch: '2019',
      department: 'ECE',
      company: 'Tesla',
      position: 'Autonomous Systems Engineer',
      location: 'Austin, TX',
      photo: '/api/placeholder/150/150',
      achievements: ['Tesla Innovation Award 2022', 'Filed 10+ patents', 'IEEE Young Engineer Award'],
      bio: 'Working on the future of transportation. Love combining hardware and software to solve real-world problems.',
      linkedin: 'https://linkedin.com/in/rahul-kumar',
      email: 'rahul.kumar@tesla.com',
      successStory: 'My journey from electronics to autonomous vehicles shows how interdisciplinary knowledge can open amazing opportunities.'
    },
    {
      id: 4,
      name: 'Sneha Patel',
      batch: '2022',
      department: 'CSE',
      company: 'Meta',
      position: 'Frontend Engineer',
      location: 'Menlo Park, CA',
      photo: '/api/placeholder/150/150',
      achievements: ['Meta Hackathon Winner 2023', 'Open Source Contributor', 'React Core Team Member'],
      bio: 'Frontend developer passionate about creating beautiful and accessible user experiences.',
      linkedin: 'https://linkedin.com/in/sneha-patel',
      email: 'sneha.patel@meta.com',
      successStory: 'Building for billions of users taught me the importance of scalable design and performance optimization.'
    }
  ];
  const filteredAlumni = alumni.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.achievements.some(achievement => achievement.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBatch = selectedBatch === 'All' || person.batch === selectedBatch;
    const matchesCompany = selectedCompany === 'All' || person.company === selectedCompany;
    return matchesSearch && matchesBatch && matchesCompany;
  });
  return (
    <div className="max-w-7xl mx-auto p-6 animate-fade-in">
      {}
      <div className="text-center mb-8 animate-slide-down">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Alumni Connect</h1>
        <p className="text-gray-600 dark:text-gray-400">Connect with successful alumni and learn from their journeys</p>
      </div>
      {}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search alumni by name, company, position, or achievements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {batches.map(batch => (
                <option key={batch} value={batch}>{batch === 'All' ? 'All Batches' : `Batch ${batch}`}</option>
              ))}
            </select>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {companies.map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAlumni.map((person, index) => (
          <div key={person.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 card-hover overflow-hidden animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
            {}
            <div className="p-6 pb-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {person.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{person.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <GraduationCap size={16} />
                    <span>Batch {person.batch} • {person.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <Briefcase size={16} />
                    <span>{person.position} at {person.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin size={16} />
                    <span>{person.location}</span>
                  </div>
                </div>
              </div>
            </div>
            {}
            <div className="px-6 pb-4">
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{person.bio}</p>
            </div>
            {}
            <div className="px-6 pb-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Key Achievements</h4>
              <div className="flex flex-wrap gap-1">
                {person.achievements.slice(0, 3).map((achievement, index) => (
                  <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                    {achievement}
                  </span>
                ))}
              </div>
            </div>
            {}
            <div className="px-6 pb-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Success Story</h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">{person.successStory}</p>
            </div>
            {}
            <div className="px-6 pb-6">
              <div className="flex gap-3">
                <button className="flex-1 btn-primary flex items-center justify-center gap-2">
                  <MessageCircle size={16} />
                  Message
                </button>
                <button className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                  <UserPlus size={16} />
                  Connect
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredAlumni.length === 0 && (
        <div className="text-center py-12">
          <GraduationCap size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No alumni found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};
export default Alumni;
