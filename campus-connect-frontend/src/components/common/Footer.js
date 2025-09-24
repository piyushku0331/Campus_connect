import React from 'react';
import '../../assets/styles/components/common/Footer.css';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h1 className="logo-text">Campus Connect</h1>
          <p>
            Connecting students, simplifying campus life.
          </p>
          <div className="contact">
            <span>&#9993; contact@campusconnect.com</span>
          </div>
        </div>
        <div className="footer-section links">
          <h2>Quick Links</h2>
          <ul>
            <li><a href="/events">Events</a></li>
            <li><a href="/placements">Placements</a></li>
            <li><a href="/community">Community</a></li>
          </ul>
        </div>
        <div className="footer-section social">
          <h2>Follow Us</h2>
          <div className="social-links">
            <a href="x.com">Twitter</a>
            <a href="linkedin.com">LinkedIn</a>
            <a href="github.com">GitHub</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Campus Connect | All rights reserved
      </div>
    </footer>
  );
};

export default Footer;