import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { profilesAPI, authAPI } from '../services/api';
import '../assets/styles/pages/ProfilePage.css';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    campus: '',
    year: '',
    department: '',
    phone: '',
    bio: '',
    linkedin: '',
    github: '',
    website: '',
    skills: [],
    interests: [],
    isPublic: true,
    profilePicture: null
  });
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');

  // Get current user ID from localStorage (assuming it's stored)
  const currentUserId = localStorage.getItem('userId'); 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let profileId = id;
        if (!profileId) {
          
          const currentUser = await authAPI.getCurrentUser();
          profileId = currentUser._id;
          navigate(`/profile/${profileId}`, { replace: true });
          return;
        }

        const profileData = await profilesAPI.getProfile(profileId);
        setUser(profileData);
        setFormData({
          name: profileData.name || '',
          campus: profileData.campus || '',
          year: profileData.year || '',
          department: profileData.department || '',
          phone: profileData.phone || '',
          bio: profileData.bio || '',
          linkedin: profileData.linkedin || '',
          github: profileData.github || '',
          website: profileData.website || '',
          skills: profileData.skills || [],
          interests: profileData.interests || [],
          isPublic: profileData.isPublic !== false,
          profilePicture: null
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, navigate]);

  const isOwnProfile = currentUserId === id;

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addInterest = () => {
    if (interestInput.trim() && !formData.interests.includes(interestInput.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interestInput.trim()]
      }));
      setInterestInput('');
    }
  };

  const removeInterest = (interestToRemove) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const submitData = new FormData();

      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'skills' || key === 'interests') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key]);
        }
      });

      const updatedProfile = await profilesAPI.updateProfile(id, submitData);
      setUser(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-container">
        <h1>Profile Not Found</h1>
        <p>The requested profile could not be found.</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="profile-header">
        <h1>{isOwnProfile ? 'My Profile' : `${user.name}'s Profile`}</h1>
        {isOwnProfile && !isEditing && (
          <button
            className="btn btn-primary"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="profile-content">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-section">
              <h2>Basic Information</h2>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="profilePicture">Profile Picture</label>
                <input
                  type="file"
                  id="profilePicture"
                  name="profilePicture"
                  onChange={handleInputChange}
                  accept="image/*"
                  className="file-input"
                />
                <small className="file-hint">Upload a new profile picture (max 5MB, JPG/PNG)</small>
              </div>

              <div className="form-group">
                <label htmlFor="campus">Campus</label>
                <input
                  type="text"
                  id="campus"
                  name="campus"
                  value={formData.campus}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="year">Year</label>
                <input
                  type="text"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="e.g., 3rd Year"
                />
              </div>

              <div className="form-group">
                <label htmlFor="department">Department</label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="e.g., Computer Science"
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Contact Information</h2>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g., +1 234 567 8900"
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Social Links</h2>
              <div className="form-group">
                <label htmlFor="linkedin">LinkedIn Profile</label>
                <input
                  type="url"
                  id="linkedin"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div className="form-group">
                <label htmlFor="github">GitHub Profile</label>
                <input
                  type="url"
                  id="github"
                  name="github"
                  value={formData.github}
                  onChange={handleInputChange}
                  placeholder="https://github.com/yourusername"
                />
              </div>

              <div className="form-group">
                <label htmlFor="website">Personal Website</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Skills</h2>
              <div className="tag-input-group">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add a skill"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <button type="button" onClick={addSkill} className="btn-add">Add</button>
              </div>
              <div className="tags-list">
                {formData.skills.map((skill, index) => (
                  <span key={index} className="tag">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)}>×</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h2>Interests</h2>
              <div className="tag-input-group">
                <input
                  type="text"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  placeholder="Add an interest"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                />
                <button type="button" onClick={addInterest} className="btn-add">Add</button>
              </div>
              <div className="tags-list">
                {formData.interests.map((interest, index) => (
                  <span key={index} className="tag">
                    {interest}
                    <button type="button" onClick={() => removeInterest(interest)}>×</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="form-section">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleInputChange}
                />
                Make profile public
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsEditing(false)}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-display">
            <div className="profile-avatar">
              <img
                src={user.profilePicture ? `http://localhost:5000/uploads/${user.profilePicture}` : '/default-avatar.png'}
                alt={`${user.name}'s avatar`}
              />
            </div>

            <div className="profile-info">
              <h2>{user.name}</h2>
              <p className="profile-role">{user.role || 'Student'}</p>

              <div className="profile-details">
                {user.campus && <p><strong>Campus:</strong> {user.campus}</p>}
                {user.year && <p><strong>Year:</strong> {user.year}</p>}
                {user.department && <p><strong>Department:</strong> {user.department}</p>}
                {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
              </div>

              {user.bio && (
                <div className="profile-section">
                  <h3>About</h3>
                  <p>{user.bio}</p>
                </div>
              )}

              {(user.linkedin || user.github || user.website) && (
                <div className="profile-section">
                  <h3>Connect</h3>
                  <div className="social-links">
                    {user.linkedin && (
                      <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                        LinkedIn
                      </a>
                    )}
                    {user.github && (
                      <a href={user.github} target="_blank" rel="noopener noreferrer" className="social-link">
                        GitHub
                      </a>
                    )}
                    {user.website && (
                      <a href={user.website} target="_blank" rel="noopener noreferrer" className="social-link">
                        Website
                      </a>
                    )}
                  </div>
                </div>
              )}

              {user.skills && user.skills.length > 0 && (
                <div className="profile-section">
                  <h3>Skills</h3>
                  <div className="tags-list">
                    {user.skills.map((skill, index) => (
                      <span key={index} className="tag">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {user.interests && user.interests.length > 0 && (
                <div className="profile-section">
                  <h3>Interests</h3>
                  <div className="tags-list">
                    {user.interests.map((interest, index) => (
                      <span key={index} className="tag">{interest}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="profile-visibility">
                <span className={`visibility-badge ${user.isPublic ? 'public' : 'private'}`}>
                  {user.isPublic ? 'Public Profile' : 'Private Profile'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;