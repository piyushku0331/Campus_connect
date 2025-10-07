import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { team } from '../data/team';
import '../assets/styles/pages/HomePage.css';

const HomePage = () => {
  useEffect(() => {
    const animateStats = () => {
      const statNumbers = document.querySelectorAll('.stat-number');

      statNumbers.forEach((stat) => {
        const target = parseInt(stat.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            stat.textContent = target.toLocaleString();
            clearInterval(timer);
          } else {
            stat.textContent = Math.floor(current).toLocaleString();
          }
        }, 20);
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateStats();
          observer.unobserve(entry.target);
        }
      });
    });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
      observer.observe(statsSection);
    }

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          sectionObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const sections = document.querySelectorAll('.features-section, .testimonials-section, .team-section, .cta-section');
    sections.forEach(section => sectionObserver.observe(section));

    let currentScrollY = 0;
    let targetScrollY = 0;
    let animationId;

    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const updateParallax = () => {
      const diff = targetScrollY - currentScrollY;
      const ease = easeOut(Math.min(Math.abs(diff) / 100, 1));
      currentScrollY += diff * ease * 0.3;

      const parallaxBg = document.querySelector('.hero-parallax-bg');
      const heroVisual = document.querySelector('.hero-visual');
      const floatingShapes = document.querySelectorAll('.shape');

      if (parallaxBg) {
        parallaxBg.style.transform = `translate3d(0, ${currentScrollY * 0.5}px, 0)`;
      }

      if (heroVisual) {
        heroVisual.style.transform = `translate3d(0, ${currentScrollY * 0.3}px, 0)`;
      }

      const time = Date.now() * 0.001;
      floatingShapes.forEach((shape, index) => {
        const parallaxSpeed = [0.2, 0.4, 0.6, 0.3][index] || 0.2;
        const floatSpeed = [1, 1.5, 0.8, 1.2][index] || 1;
        const floatAmplitude = 15 + index * 5;
        const parallaxY = currentScrollY * parallaxSpeed;
        const floatY = Math.sin(time * floatSpeed) * floatAmplitude;
        shape.style.transform = `translate3d(0, ${parallaxY + floatY}px, 0)`;
      });

      animationId = requestAnimationFrame(updateParallax);
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY;
      if (!animationId) {
        animationId = requestAnimationFrame(updateParallax);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
        <div className="hero-parallax-bg"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-text">Welcome to </span>
            <span className="hero-highlight">Campus Connect</span>
          </h1>
          <p className="hero-description">
            Your ultimate college companion for <span className="highlight-text">events</span>,
            <span className="highlight-text"> notices</span>, and
            <span className="highlight-text"> community connections</span>.
          </p>
          <div className="hero-features">
            <div className="feature-badge">
              <span className="badge-icon">🚀</span>
              <span>Free Forever</span>
            </div>
            <div className="feature-badge">
              <span className="badge-icon">🔒</span>
              <span>Secure & Private</span>
            </div>
            <div className="feature-badge">
              <span className="badge-icon">📱</span>
              <span>Mobile Friendly</span>
            </div>
          </div>
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
            <div className="shape shape4"></div>
          </div>
          <div className="hero-stats-preview">
            <div className="preview-stat">
              <span className="preview-number">15K+</span>
              <span className="preview-label">Students</span>
            </div>
            <div className="preview-stat">
              <span className="preview-number">500+</span>
              <span className="preview-label">Events</span>
            </div>
            <div className="preview-stat">
              <span className="preview-number">1.2K+</span>
              <span className="preview-label">Resources</span>
            </div>
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

      <div className="stats-section">
        <h2 className="section-title">Campus Connect by Numbers</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number" data-target="15000">0</div>
            <div className="stat-label">Active Students</div>
            <div className="stat-description">Students using our platform daily</div>
          </div>
          <div className="stat-item">
            <div className="stat-number" data-target="500">0</div>
            <div className="stat-label">Events Hosted</div>
            <div className="stat-description">Successful events organized this year</div>
          </div>
          <div className="stat-item">
            <div className="stat-number" data-target="1200">0</div>
            <div className="stat-label">Study Materials</div>
            <div className="stat-description">Resources shared by students</div>
          </div>
          <div className="stat-item">
            <div className="stat-number" data-target="98">0</div>
            <div className="stat-label">User Satisfaction</div>
            <div className="stat-description">Students rate us 5 stars</div>
          </div>
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