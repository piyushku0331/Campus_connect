import React, { useEffect, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
const LandingPage = () => {
  const [showButton, setShowButton] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 3000);
    const autoRedirect = setTimeout(() => {
      window.location.href = '/login';
    }, 6000);
    return () => {
      clearTimeout(timer);
      clearTimeout(autoRedirect);
    };
  }, []);
  const handleEnter = () => {
    window.location.href = '/login';
  };
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center relative overflow-hidden">
      {}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
        {}
        <div className="absolute top-20 left-20 w-2 h-2 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }} />
        <div className="absolute top-40 right-32 w-1 h-1 bg-secondary/40 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '4s' }} />
        <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-accent/30 rounded-full animate-bounce" style={{ animationDelay: '3s', animationDuration: '5s' }} />
      </div>
      <div className="text-center z-10 px-4 max-w-4xl mx-auto">
        <div className="mb-8 animate-slide-up">
          <TypeAnimation
            sequence={[
              'Welcome',
              1000,
              'स्वागत है',
              1000,
              'ਸਤ ਸ੍ਰੀ ਅਕਾਲ',
              1000,
              'नमस्ते',
              1000,
              'Bonjour',
              1000,
              'Hola',
              1000,
              'Ciao',
              1000,
              'こんにちは',
              1000,
            ]}
            wrapper="h1"
            speed={50}
            className="text-6xl md:text-8xl font-bold text-gradient mb-4 drop-shadow-lg"
            repeat={Infinity}
          />
        </div>
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Campus Connect
          </h2>
          <p className="text-xl md:text-2xl text-white/90 font-medium leading-relaxed">
            Connecting Chitkara Minds Across the Campus
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-white/70">
            <span className="px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">📚 Study Materials</span>
            <span className="px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">🤝 Networking</span>
            <span className="px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">🎯 Career Growth</span>
            <span className="px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">💬 Real-time Chat</span>
          </div>
        </div>
        {showButton && (
          <div className="animate-scale-in flex flex-col items-center gap-4" style={{ animationDelay: '1s' }}>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleEnter}
                className="btn-primary text-xl px-10 py-5 shadow-2xl hover:shadow-primary/25 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Login to Account
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              <button
                onClick={() => window.location.href = '/signup'}
                className="btn-outline text-xl px-10 py-5 shadow-2xl hover:shadow-secondary/25 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Create Account
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </span>
              </button>
            </div>
            <p className="text-white/60 text-sm animate-fade-in text-center" style={{ animationDelay: '1.5s' }}>
              Join thousands of Chitkara students and alumni in our vibrant community
            </p>
          </div>
        )}
      </div>
      {}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};
export default LandingPage;
