import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/pages/PreLandingPage.css';

const PreLandingPage = () => {
  const [currentLanguageIndex, setCurrentLanguageIndex] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();

  const languages = [
    { code: 'en', greeting: 'Welcome to Campus Connect', subtitle: 'Your ultimate college companion' },
    { code: 'hi', greeting: 'कैंपस कनेक्ट में आपका स्वागत है', subtitle: 'आपका अंतिम कॉलेज साथी' },
    { code: 'es', greeting: 'Bienvenido a Campus Connect', subtitle: 'Tu compañero universitario definitivo' },
    { code: 'fr', greeting: 'Bienvenue sur Campus Connect', subtitle: 'Votre compagnon universitaire ultime' },
    { code: 'de', greeting: 'Willkommen bei Campus Connect', subtitle: 'Ihr ultimative College-Begleiter' },
    { code: 'zh', greeting: '欢迎来到校园连接', subtitle: '您最终的大学伴侣' },
    { code: 'ja', greeting: 'キャンパスコネクトへようこそ', subtitle: '究極の大学仲間' }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    
    const languageInterval = setInterval(() => {
      setCurrentLanguageIndex((prev) => (prev + 1) % languages.length);
    }, 3000);

    
    const redirectTimer = setTimeout(() => {
      navigate('/home');
    }, 15000);

    return () => {
      clearInterval(languageInterval);
      clearTimeout(redirectTimer);
    };
  }, [navigate, languages.length]);

  const currentLanguage = languages[currentLanguageIndex];

  return (
    <div className="prelanding-container">
      <div className={`prelanding-content ${showContent ? 'show' : ''}`}>
        <div className="logo-section">
          <div className="logo">
            <img src="/logo.ico" alt="Campus Connect Logo" className="logo-icon" />
            <h1 className="site-name">Campus Connect</h1>
          </div>
        </div>

        <div className="greeting-section">
          <div className="greeting-container">
            <h1 className="greeting-text">{currentLanguage.greeting}</h1>
            <p className="greeting-subtitle">{currentLanguage.subtitle}</p>
          </div>

          <div className="language-indicator">
            <span className="current-lang">{currentLanguage.code.toUpperCase()}</span>
            <div className="lang-dots">
              {languages.map((lang, index) => (
                <span
                  key={lang.code}
                  className={`lang-dot ${index === currentLanguageIndex ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>

          <button className="skip-btn" onClick={() => navigate('/home')}>
            Enter Campus Connect
          </button>
        </div>

      </div>
    </div>
  );
};

export default PreLandingPage;