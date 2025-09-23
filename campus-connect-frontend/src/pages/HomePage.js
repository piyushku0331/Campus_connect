import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/pages/HomePage.css';

const HomePage = () => {
  const team = [
    {
      name: 'Alex Rodriguez',
      role: 'Lead Developer',
      image: '👨‍💻',
      bio: 'Passionate about creating innovative solutions for education.'
    },
    {
      name: 'Sofia Patel',
      role: 'UI/UX Designer',
      image: '👩‍🎨',
      bio: 'Crafting beautiful and intuitive user experiences.'
    },
    {
      name: 'David Kim',
      role: 'Product Manager',
      image: '👨‍🏫',
      bio: 'Ensuring Campus Connect meets student needs perfectly.'
    },
    {
      name: 'Lisa Wong',
      role: 'Backend Engineer',
      image: '👩‍🔧',
      bio: 'Building robust and scalable systems for our platform.'
    }
  ];

  const features = [
    {
      icon: '📅',
      title: 'Events',
      description: 'Discover and join campus events, workshops, and activities.',
      link: '/events'
    },
    {
      icon: '📋',
      title: 'Notice Board',
      description: 'Stay updated with important announcements and notices.',
      link: '/notice-board'
    },
    {
      icon: '💼',
      title: 'Placements',
      description: 'Find job opportunities and career resources.',
      link: '/placements'
    },
    {
      icon: '👥',
      title: 'Community',
      description: 'Connect with fellow students and share your thoughts.',
      link: '/community'
    },
    {
      icon: '📚',
      title: 'Study Materials',
      description: 'Access shared study resources and notes.',
      link: '/study-hub'
    },
    {
      icon: '🔍',
      title: 'Lost & Found',
      description: 'Report and find lost items on campus.',
      link: '/lost-and-found'
    }
  ];

  return (
    <div className="homepage-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Campus Connect</h1>
          <p className="hero-description">Your ultimate college companion for events, notices, and community connections.</p>
          <div className="hero-buttons">
            <Link to="/login" className="btn btn-primary">Get Started</Link>
            <Link to="/about" className="btn btn-secondary">Learn More</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-shapes">
            <div className="shape shape1"></div>
            <div className="shape shape2"></div>
            <div className="shape shape3"></div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">Explore Campus Features</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <Link key={index} to={feature.link} className="feature-card card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="testimonials-section">
        <h2 className="section-title">What Our Users Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card card">
            <div className="testimonial-content">
              <p>"Campus Connect has completely transformed how I stay connected with my university community. The events feature is amazing!"</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">👨‍🎓</div>
              <div className="author-info">
                <h4>Sarah Johnson</h4>
                <span>Computer Science Student</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card card">
            <div className="testimonial-content">
              <p>"Finding study materials and placement opportunities has never been easier. This platform is a game-changer for students."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">👩‍💼</div>
              <div className="author-info">
                <h4>Mike Chen</h4>
                <span>Engineering Student</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card card">
            <div className="testimonial-content">
              <p>"The community features help me connect with like-minded students. Campus Connect feels like home away from home."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">👨‍🔬</div>
              <div className="author-info">
                <h4>Emily Davis</h4>
                <span>Science Student</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="team-section">
        <h2 className="section-title">Meet Our Team</h2>
        <div className="team-grid">
          {team.map((member, index) => (
            <div key={index} className="team-member card">
              <div className="member-avatar">{member.image}</div>
              <h3>{member.name}</h3>
              <p className="member-role">{member.role}</p>
              <p className="member-bio">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to Connect?</h2>
        <p>Join thousands of students already using Campus Connect</p>
        <Link to="/signup" className="btn btn-primary">Join Now</Link>
      </div>
    </div>
  );
};

export default HomePage;