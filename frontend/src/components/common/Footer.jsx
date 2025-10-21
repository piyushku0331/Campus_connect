import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
const Footer = () => {
  return (
    <footer className="relative bg-surface/80 backdrop-blur-md border-t border-borderSubtle py-8 sm:py-12 md:py-16 mt-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
      <div className="absolute inset-0 bg-ambient-overlay opacity-20 animate-breathe"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-12">
          <div className="md:col-span-2 flex flex-col md:flex-row md:justify-between md:items-start">
            <div className="md:flex-1">
              <Link to="/" className="flex items-center space-x-3 mb-4 hover:scale-105 transition-transform duration-300">
                <img src="/image.png" alt="Campus Connect" className="h-8 w-auto rounded-lg" />
                <span className="text-2xl font-bold cinematic-heading">Campus Connect</span>
              </Link>
              <p className="text-textMuted leading-relaxed mb-6 max-w-md animate-fade-in-up">
                Connecting students, fostering collaboration, and building communities on campus.
                Join thousands of students in their journey of growth and discovery.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 glass-card rounded-full flex items-center justify-center text-textMuted hover:text-primary hover:border-primary/40 transition-all duration-300 hover:shadow-cinematic-glow hover:scale-110 animate-float"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 glass-card rounded-full flex items-center justify-center text-textMuted hover:text-primary hover:border-primary/40 transition-all duration-300 hover:shadow-cinematic-glow hover:scale-110 animate-float"
                  style={{ animationDelay: '0.5s' }}
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 glass-card rounded-full flex items-center justify-center text-textMuted hover:text-primary hover:border-primary/40 transition-all duration-300 hover:shadow-cinematic-glow hover:scale-110 animate-float"
                  style={{ animationDelay: '1s' }}
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 glass-card rounded-full flex items-center justify-center text-textMuted hover:text-primary hover:border-primary/40 transition-all duration-300 hover:shadow-cinematic-glow hover:scale-110 animate-float"
                  style={{ animationDelay: '1.5s' }}
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div className="md:ml-8 mt-6 md:mt-0 flex flex-col md:flex-row gap-8 md:gap-12">
              <div>
                <h4 className="text-lg font-semibold text-textPrimary mb-6 gradient-text-subtle">Quick Links</h4>
                <ul className="space-y-3">
                  <li>
                    <Link to="/" className="text-textMuted hover:text-primary transition-all duration-300 hover:translate-x-1 hover:shadow-glow-primary">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard" className="text-textMuted hover:text-primary transition-all duration-300 hover:translate-x-1 hover:shadow-glow-primary">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/events" className="text-textMuted hover:text-primary transition-all duration-300 hover:translate-x-1 hover:shadow-glow-primary">
                      Events
                    </Link>
                  </li>
                  <li>
                    <Link to="/networking" className="text-textMuted hover:text-primary transition-all duration-300 hover:translate-x-1 hover:shadow-glow-primary">
                      Networking
                    </Link>
                  </li>
                  <li>
                    <Link to="/resources" className="text-textMuted hover:text-primary transition-all duration-300 hover:translate-x-1 hover:shadow-glow-primary">
                      Resources
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-textPrimary mb-6 gradient-text-subtle">Support</h4>
                <ul className="space-y-3">
                  <li>
                    <Link to="/help" className="text-textMuted hover:text-primary transition-all duration-300 hover:translate-x-1 hover:shadow-glow-primary">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-textMuted hover:text-primary transition-all duration-300 hover:translate-x-1 hover:shadow-glow-primary">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy" className="text-textMuted hover:text-primary transition-all duration-300 hover:translate-x-1 hover:shadow-glow-primary">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="text-textMuted hover:text-primary transition-all duration-300 hover:translate-x-1 hover:shadow-glow-primary">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-borderSubtle pt-6 sm:pt-8">
          <div className="flex flex-col gap-4 sm:gap-6 md:flex-row justify-between items-center">
            <p className="text-textMuted text-sm animate-fade-in">
              &copy; 2025 Campus Connect. All rights reserved.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-4 md:mt-0">
              <div className="flex items-center gap-2 text-textMuted text-sm hover:text-primary transition-colors duration-300 animate-shimmer">
                <Mail className="w-4 h-4" />
                <span>support@campusconnect.com</span>
              </div>
              <div className="flex items-center gap-2 text-textMuted text-sm hover:text-primary transition-colors duration-300 animate-shimmer" style={{ animationDelay: '0.5s' }}>
                <Phone className="w-4 h-4" />
                <span>+91 7988327875</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
