import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, GraduationCap, MessageCircle, UserPlus, Filter } from 'lucide-react';
import { usersAPI } from '../services/api';
import { useSocket } from '../hooks/useSocket';

const Alumni = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const batches = ['All', '2024', '2023', '2022', '2021', '2020', '2019', '2018'];
  const companies = ['All', 'Google', 'Microsoft', 'Amazon', 'Meta', 'Adobe', 'Netflix', 'Apple', 'Tesla'];

  const { onAlumniAdded, onAlumniUpdated, onAlumniRemoved } = useSocket();

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        setLoading(true);
        const response = await usersAPI.getAlumni();
        setAlumni(response.data);
      } catch (err) {
        console.error('Error fetching alumni:', err);
        setError('Failed to load alumni data');
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  // Set up real-time listeners
  useEffect(() => {
    const unsubscribeAdded = onAlumniAdded((data) => {
      console.log('Alumni added:', data);
      setAlumni(prev => [...prev, data.user]);
    });

    const unsubscribeUpdated = onAlumniUpdated((data) => {
      console.log('Alumni updated:', data);
      setAlumni(prev => prev.map(alumni =>
        alumni.id === data.user.id ? data.user : alumni
      ));
    });

    const unsubscribeRemoved = onAlumniRemoved((data) => {
      console.log('Alumni removed:', data);
      setAlumni(prev => prev.filter(alumni => alumni.id !== data.userId));
    });

    return () => {
      unsubscribeAdded?.();
      unsubscribeUpdated?.();
      unsubscribeRemoved?.();
    };
  }, [onAlumniAdded, onAlumniUpdated, onAlumniRemoved]);

  const filteredAlumni = alumni.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (person.company && person.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (person.position && person.position.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (person.alumniAchievements && person.alumniAchievements.some(achievement => achievement.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesBatch = selectedBatch === 'All' || person.batch === selectedBatch;
    const matchesCompany = selectedCompany === 'All' || person.company === selectedCompany;
    return matchesSearch && matchesBatch && matchesCompany;
  });
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-linear-to-br from-black/70 via-black/50 to-black/70"></div>
      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-accent-gradient">
            Alumni Connect
          </h1>
          <p className="text-lg text-textMuted max-w-2xl mx-auto">
            Connect with successful alumni and learn from their journeys
          </p>
        </motion.div>
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card rounded-2xl p-8 mb-12"
        >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search alumni by name, company, position, or achievements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-surface/50 border border-borderSubtle rounded-xl text-textPrimary placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="px-4 py-3 bg-surface/50 border border-borderSubtle rounded-xl text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
            >
              {batches.map(batch => (
                <option key={batch} value={batch}>{batch === 'All' ? 'All Batches' : `Batch ${batch}`}</option>
              ))}
            </select>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="px-4 py-3 bg-surface/50 border border-borderSubtle rounded-xl text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
            >
              {companies.map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>
          </div>
        </div>
        </motion.div>
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
        {loading ? (
          <div className="col-span-full flex justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-textMuted">Loading alumni...</p>
            </div>
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-16">
            <GraduationCap size={64} className="mx-auto text-textMuted mb-4" />
            <h3 className="text-xl font-semibold text-textPrimary mb-2">Error loading alumni</h3>
            <p className="text-textMuted">{error}</p>
          </div>
        ) : filteredAlumni.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-16"
          >
            <GraduationCap size={64} className="mx-auto text-textMuted mb-4" />
            <h3 className="text-xl font-semibold text-textPrimary mb-2">No alumni found</h3>
            <p className="text-textMuted">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          filteredAlumni.map((person, index) => (
            <motion.div
              key={person.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-card rounded-2xl border border-borderSubtle hover:shadow-cinematic-glow hover:scale-105 transition-all duration-500 interactive-element overflow-hidden"
            >
              {}
              <div className="p-6 pb-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-linear-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {person.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-textPrimary mb-2">{person.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-textMuted mb-2">
                      <GraduationCap size={16} className="text-primary" />
                      <span>Batch {person.batch} • {person.department}</span>
                    </div>
                    {person.position && person.company && (
                      <div className="flex items-center gap-2 text-sm text-textMuted mb-2">
                        <Briefcase size={16} className="text-secondary" />
                        <span>{person.position} at {person.company}</span>
                      </div>
                    )}
                    {person.location && (
                      <div className="flex items-center gap-2 text-sm text-textMuted">
                        <MapPin size={16} className="text-accent" />
                        <span>{person.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {}
              {person.bio && (
                <div className="px-6 pb-4">
                  <p className="text-textSecondary text-sm leading-relaxed">{person.bio}</p>
                </div>
              )}
              {}
              {person.alumniAchievements && person.alumniAchievements.length > 0 && (
                <div className="px-6 pb-4">
                  <h4 className="text-sm font-semibold text-textPrimary mb-3">Key Achievements</h4>
                  <div className="flex flex-wrap gap-2">
                    {person.alumniAchievements.slice(0, 3).map((achievement, index) => (
                      <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        {achievement}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {}
              {person.successStory && (
                <div className="px-6 pb-4">
                  <h4 className="text-sm font-semibold text-textPrimary mb-2">Success Story</h4>
                  <p className="text-textSecondary text-sm line-clamp-3">{person.successStory}</p>
                </div>
              )}
              {}
              <div className="px-6 pb-6">
                <div className="flex gap-3">
                  <button
                    onClick={() => alert('Messaging feature coming soon')}
                    className="flex-1 bg-accent-gradient text-white font-medium py-3 px-6 rounded-xl hover:shadow-glow-accent hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={16} />
                    Message
                  </button>
                  <button
                    onClick={() => alert('Connection request sent')}
                    className="flex-1 glass-effect border border-borderSubtle text-textPrimary hover:border-primary/60 px-4 py-3 rounded-xl hover:bg-primary/10 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <UserPlus size={16} />
                    Connect
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
        </motion.div>
      </div>
    </div>
  );
};
export default Alumni;
