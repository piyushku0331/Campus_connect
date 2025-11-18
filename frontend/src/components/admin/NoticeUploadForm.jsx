import React, { useState } from 'react';
import { Upload, Tag, FileText } from 'lucide-react';
import { noticesAPI } from '../../services/api';
import VisionButton from '../ui/VisionButton';

const NoticeUploadForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    file: null
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      setFormData({
        ...formData,
        file: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.file) {
      console.error('Please select a file to upload');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('file', formData.file);

      await noticesAPI.createNotice(formDataToSend);
      setFormData({
        title: '',
        category: '',
        file: null
      });
      // Reset file input
      document.getElementById('file').value = '';
    } catch (err) {
      console.error('Failed to upload notice:', err.message || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-[0_0_10px_rgba(0,217,255,0.5)]">Upload Notice</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="text-white font-medium mb-2 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#2F4FFF]" />
            Notice Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-[#0A0F2C]/80 border border-[#1A2759] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CEBFF]/40 focus:border-[#0CEBFF]/30 focus:shadow-[0_0_10px_rgba(0,217,255,0.3)] transition-all duration-300"
            placeholder="Enter notice title"
          />
        </div>

        <div>
          <label htmlFor="category" className="text-white font-medium mb-2 flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#00F59B]" />
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
            <option value="Administrative" className="bg-[#0A0F2C]">Administrative</option>
            <option value="Events" className="bg-[#0A0F2C]">Events</option>
            <option value="Examinations" className="bg-[#0A0F2C]">Examinations</option>
            <option value="General" className="bg-[#0A0F2C]">General</option>
            <option value="Scholarships" className="bg-[#0A0F2C]">Scholarships</option>
          </select>
        </div>

        <div>
          <label htmlFor="file" className="text-white font-medium mb-2 flex items-center gap-2">
            <Upload className="w-5 h-5 text-[#FF3CF0]" />
            Upload File
          </label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleChange}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            required
            className="w-full px-4 py-3 bg-[#0A0F2C]/80 border border-[#1A2759] rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-linear-to-r file:from-[#8B5CF6] file:to-[#FF3CF0] file:text-white hover:file:shadow-[0_0_10px_rgba(255,60,240,0.5)] transition-all duration-300"
          />
          <small className="text-gray-300 text-sm mt-1 block">
            Supported formats: PDF, DOC, DOCX, JPG, PNG (Max: 10MB)
          </small>
        </div>

        <VisionButton
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
          loading={loading}
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Notice'}
        </VisionButton>
      </form>
    </div>
  );
};

export default NoticeUploadForm;