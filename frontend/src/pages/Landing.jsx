import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BgImport from '../components/background/bgimport';
const Landing = () => {
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();
  const logoRef = useRef(null);
  const textRef = useRef(null);
  const loadingRef = useRef(null);
  useEffect(() => {
    const showTimer = setTimeout(() => setShowContent(true), 300);
    const redirectTimer = setTimeout(() => {
      navigate('/home');
    }, 4000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);
  useEffect(() => {
    if (showContent) {
      if (logoRef.current) {
        logoRef.current.style.animation = 'fadeInUp 1s ease-out 0.2s both';
      }
      if (textRef.current) {
        textRef.current.style.animation = 'fadeInUp 1s ease-out 0.6s both';
      }
      if (loadingRef.current) {
        loadingRef.current.style.animation = 'fadeIn 0.8s ease-out 1.2s both';
      }
    }
  }, [showContent]);
  return (
    <div className="min-h-screen perspective-root flex flex-col items-center justify-center bg-gradient-to-br from-[#0A0A0F] via-[#101020] to-[#0A0A0F] relative overflow-hidden animated-gradient-bg">
      <BgImport />
      {}
      <div className="absolute inset-0 bg-ambient-overlay animate-breathe"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#6B9FFF]/5 rounded-full blur-3xl animate-floating-shapes animate-drift"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7F40FF]/5 rounded-full blur-3xl animate-morphing-blob animate-drift" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#FF7F50]/3 rounded-full blur-2xl animate-wave-motion animate-color-shift" style={{ animationDelay: '4s' }}></div>
      </div>
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {}
        <div ref={logoRef} className="mb-12 card-3d tilt-3d parallax-group">
          <img
            src="/image.png"
            alt="Campus Connect Logo"
            loading="lazy"
            data-depth="0.6"
            className="w-32 h-32 mx-auto rounded-2xl shadow-2xl"
          />
        </div>
        {}
        <div ref={textRef} className="mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#6B9FFF] to-[#7F40FF] bg-clip-text text-transparent">
            Welcome to Campus Connect
          </h1>
          <p className="text-lg sm:text-xl text-textMuted max-w-2xl mx-auto leading-relaxed">
            Connect, learn, and grow with your campus community
          </p>
        </div>
        {}
        <div ref={loadingRef} className="mt-12">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-[#6B9FFF] rounded-full animate-pulse animate-color-shift"></div>
            <div className="w-3 h-3 bg-[#7F40FF] rounded-full animate-pulse animate-color-shift" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-[#FF7F50] rounded-full animate-pulse animate-color-shift" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <p className="text-textMuted mt-4 text-sm animate-fade-in loading-dots">
            Preparing your experience
          </p>
        </div>
      </div>
    </div>
  );
};
export default Landing;
