import React, { useState } from 'react';
import { Calendar, MapPin, Tag, FileText } from 'lucide-react';
import { eventsAPI } from '../../services/api';
import VisionButton from '../ui/VisionButton';

const EventPostingForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    campus: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await eventsAPI.createEvent(formData);
      setFormData({
        title: '',
        description: '',
        date: '',
        campus: '',
        category: ''
      });
    } catch (err) {
      console.error('Failed to post event:', err.message || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-[0_0_10px_rgba(0,217,255,0.5)]">Post New Event</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="text-white font-medium mb-2 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#2F4FFF]" />
            Event Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-[#0A0F2C]/80 border border-[#1A2759] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CEBFF]/40 focus:border-[#0CEBFF]/30 focus:shadow-[0_0_10px_rgba(0,217,255,0.3)] transition-all duration-300"
            placeholder="Enter event title"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-white font-medium mb-2">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-[#0A0F2C]/80 border border-[#1A2759] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CEBFF]/40 focus:border-[#0CEBFF]/30 focus:shadow-[0_0_10px_rgba(0,217,255,0.3)] transition-all duration-300 resize-none"
            placeholder="Describe the event..."
            rows="4"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="date" className="text-white font-medium mb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#00F59B]" />
              Date & Time
            </label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#0A0F2C]/80 border border-[#1A2759] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#0CEBFF]/40 focus:border-[#0CEBFF]/30 focus:shadow-[0_0_10px_rgba(0,217,255,0.3)] transition-all duration-300"
            />
          </div>

          <div>
            <label htmlFor="campus" className="text-white font-medium mb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#FF3CF0]" />
              Campus
            </label>
            <select
              id="campus"
              name="campus"
              value={formData.campus}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#0A0F2C]/80 border border-[#1A2759] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#0CEBFF]/40 focus:border-[#0CEBFF]/30 focus:shadow-[0_0_10px_rgba(0,217,255,0.3)] transition-all duration-300"
            >
              <option value="" className="bg-[#0A0F2C]">Select Campus</option>
              <option value="Main Campus" className="bg-[#0A0F2C]">Main Campus</option>
              <option value="North Campus" className="bg-[#0A0F2C]">North Campus</option>
              <option value="South Campus" className="bg-[#0A0F2C]">South Campus</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="category" className="text-white font-medium mb-2 flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#8B5CF6]" />
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-[#0A0F2C]/80 border border-[#1A2759] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#0CEBFF]/40 focus:border-[#0CEBFF]/30 focus:shadow-[0_0_10px_rgba(0,217,255,0.3)] transition-all duration-300"
          >
            <option value="" className="bg-[#0A0F2C]">Select Category</option>
            <option value="Academic" className="bg-[#0A0F2C]">Academic</option>
            <option value="Sports" className="bg-[#0A0F2C]">Sports</option>
            <option value="Cultural" className="bg-[#0A0F2C]">Cultural</option>
            <option value="Technical" className="bg-[#0A0F2C]">Technical</option>
            <option value="Social" className="bg-[#0A0F2C]">Social</option>
            <option value="Career" className="bg-[#0A0F2C]">Career</option>
          </select>
        </div>

        <VisionButton
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
          loading={loading}
          disabled={loading}
        >
          {loading ? 'Posting Event...' : 'Post Event'}
        </VisionButton>
      </form>
    </div>
  );
};

export default EventPostingForm;