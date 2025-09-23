import React from 'react';
import { team } from '../data/team';
import '../assets/styles/pages/AboutPage.css';

const AboutPage = () => {

  const features = [
    {
      icon: '🚀',
      title: 'Fast & Reliable',
      description: 'Built with modern technologies for optimal performance.'
    },
    {
      icon: '🔒',
      title: 'Secure',
      description: 'Your data is protected with industry-standard security measures.'
    },
    {
      icon: '📱',
      title: 'Responsive',
      description: 'Works perfectly on all devices - desktop, tablet, and mobile.'
    },
    {
      icon: '🌟',
      title: 'User-Friendly',
      description: 'Intuitive design that makes campus life easier.'
    }
  ];

  return (
    <div className="page-container">
      <div className="about-container">
      <div className="about-hero">
        <h1>About Campus Connect</h1>
        <p>Empowering students with the ultimate campus companion platform</p>
      </div>

      <div className="about-content">
        <section className="mission-section">
          <h2>Our Mission</h2>
          <p>
            Campus Connect is designed to bridge the gap between students, faculty, and campus resources.
            We believe that technology should simplify campus life, not complicate it. Our platform
            serves as a central hub for all campus-related activities, information, and connections.
          </p>
        </section>

        <section className="features-section">
          <h2>Why Choose Campus Connect?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-item card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="team-section">
          <h2>Meet Our Team</h2>
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
        </section>

        <section className="stats-section">
          <h2>Our Impact</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Active Students</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Events Hosted</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1,200+</div>
              <div className="stat-label">Study Materials</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support Available</div>
            </div>
          </div>
        </section>
      </div>
    </div>
    </div>
  );
};

export default AboutPage;