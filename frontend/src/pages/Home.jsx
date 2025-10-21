import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Leaderboard from '../components/gamification/Leaderboard';
const useParallax = (speed = 0.5) => {
  const elementRef = useRef(null);
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          const rate = scrolled * -speed;
          element.style.transform = `translateY(${rate}px) translateZ(0)`;
          element.style.willChange = 'transform';
          ticking = false;
        });
        ticking = true;
      }
    };
    const initialScroll = window.pageYOffset;
    const initialRate = initialScroll * -speed;
    element.style.transform = `translateY(${initialRate}px) translateZ(0)`;
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);
  return elementRef;
};
const Home = () => {
  const heroRef = useParallax(0.3);
  const featuresRef = useRef(null);
  const teamRef = useRef(null);
  const parallaxRef1 = useParallax(0.2);
  const parallaxRef2 = useParallax(0.4);
  const parallaxRef3 = useParallax(0.1);
  const t = {
    welcome: 'Welcome to Campus Connect',
    subtitle: 'Connect, learn, and grow with your campus community',
    earnPoints: '🏆 Earn Points',
    earnPointsDesc: 'Create events, make connections, and share resources to earn points and unlock achievements',
    climbLeaderboard: '📈 Climb the Leaderboard',
    climbLeaderboardDesc: 'Compete with fellow students and see how you rank on the campus leaderboard',
    unlockAchievements: '🎖️ Unlock Achievements',
    unlockAchievementsDesc: 'Complete challenges and reach milestones to earn badges and recognition',
    getStarted: 'Get Started Today',
    joinCommunity: 'Join our global campus community and start your journey',
    signUp: 'Sign Up Now',
    teamTitle: 'Our Team',
    teamSubtitle: 'Meet the amazing people behind Campus Connect',
    teamLocation: 'Based at Chitkara University, Punjab 140401',
    teamMembers: ['Piyush', 'Pranav', 'Pranjal', 'Prachi']
  };
  useEffect(() => {
    if (featuresRef.current) {
      const featureCards = featuresRef.current.querySelectorAll('.feature-card');
      featureCards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.8s ease-out ${index * 0.2}s both`;
      });
    }
    if (teamRef.current) {
      const teamMembers = teamRef.current.querySelectorAll('.team-member');
      teamMembers.forEach((member, index) => {
        member.style.animation = `fadeInScale 1s ease-out ${index * 0.15}s both`;
      });
    }
  }, []);
  return (
    <div className="min-h-screen flex flex-col floating-particles floating-particles-enhanced dynamic-bg-elements depth-layer-1 pt-16">
      {}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden depth-layer-2">
        <div ref={heroRef} className="absolute inset-0 bg-hero-bg bg-cover bg-center parallax-element"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/75 to-black/85"></div>
        <div className="absolute inset-0 bg-ambient-overlay animate-breathe"></div>
        {}
        <div ref={parallaxRef1} className="absolute top-20 left-10 w-32 h-32 bg-blue-400 rounded-full blur-xl animate-parallax-float opacity-30"></div>
        <div ref={parallaxRef2} className="absolute bottom-32 right-16 w-24 h-24 bg-purple-400 rounded-full blur-lg animate-parallax-float opacity-40" style={{ animationDelay: '1s' }}></div>
        <div ref={parallaxRef3} className="absolute top-1/2 left-1/4 w-16 h-16 bg-orange-400 rounded-full blur-md animate-parallax-float opacity-50" style={{ animationDelay: '2s' }}></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center depth-layer-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight mb-4 sm:mb-6 cinematic-heading text-wave">
              {t.welcome.split('').map((char, index) => (
                <span key={index}>{char === ' ' ? '\u00A0' : char}</span>
              ))}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-textMuted max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-12 animate-fade-in-up px-4">
              {t.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/signup"
                className="glass-card text-white font-medium px-8 py-3 rounded-full hover:shadow-cinematic-glow hover:scale-105 transition-all duration-500 animate-pulse-glow interactive-element morphing-border"
              >
                {t.signUp}
              </Link>
              <Link
                to="/login"
                className="glass-effect border border-primary/30 text-primary hover:border-primary/60 px-8 py-3 rounded-full font-medium hover:bg-primary/10 transition-all duration-500 animate-shimmer interactive-element"
              >
                {t.getStarted}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      {}
      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-features-bg bg-cover bg-center parallax-bg"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/90"></div>
        <div className="absolute inset-0 bg-ambient-overlay opacity-20"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-semibold text-textPrimary mb-4 cinematic-heading">Features</h2>
            <p className="text-textMuted max-w-2xl mx-auto animate-fade-in-up">Discover what makes Campus Connect special</p>
          </motion.div>
          <div ref={featuresRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="feature-card glass-card rounded-2xl p-8 hover:shadow-cinematic-glow hover:scale-105 transition-all duration-500 animate-depth-pulse interactive-element animate-wave-motion">
              <div className="text-4xl mb-4 animate-float animate-color-shift">{t.earnPoints.split(' ')[0]}</div>
              <h3 className="text-xl font-semibold text-textPrimary mb-3">{t.earnPoints}</h3>
              <p className="text-textMuted leading-relaxed">{t.earnPointsDesc}</p>
            </div>
            <div className="feature-card glass-card rounded-2xl p-8 hover:shadow-cinematic-glow hover:scale-105 transition-all duration-500 animate-depth-pulse interactive-element animate-morphing-blob" style={{animationDelay: '2s'}}>
              <div className="text-4xl mb-4 animate-float animate-color-shift" style={{animationDelay: '0.5s'}}>{t.climbLeaderboard.split(' ')[0]}</div>
              <h3 className="text-xl font-semibold text-textPrimary mb-3">{t.climbLeaderboard}</h3>
              <p className="text-textMuted leading-relaxed">{t.climbLeaderboardDesc}</p>
            </div>
            <div className="feature-card glass-card rounded-2xl p-8 hover:shadow-cinematic-glow hover:scale-105 transition-all duration-500 animate-depth-pulse interactive-element animate-floating-shapes" style={{animationDelay: '4s'}}>
              <div className="text-4xl mb-4 animate-float animate-color-shift" style={{animationDelay: '1s'}}>{t.unlockAchievements.split(' ')[0]}</div>
              <h3 className="text-xl font-semibold text-textPrimary mb-3">{t.unlockAchievements}</h3>
              <p className="text-textMuted leading-relaxed">{t.unlockAchievementsDesc}</p>
            </div>
          </div>
        </div>
      </section>
      {}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 glass-gradient opacity-60"></div>
        <div className="absolute inset-0 bg-ambient-overlay animate-breathe"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-semibold text-textPrimary mb-4 cinematic-heading">Leaderboard</h2>
            <p className="text-textMuted max-w-2xl mx-auto animate-fade-in-up">See how you stack up against other students</p>
          </motion.div>
          <div className="glass-card rounded-2xl p-8 animate-cinematic-fade">
            <Leaderboard />
          </div>
        </div>
      </section>
      {}
      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-ambient-overlay opacity-30"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-semibold text-textPrimary mb-4 cinematic-heading">{t.teamTitle}</h2>
            <p className="text-textMuted max-w-2xl mx-auto animate-fade-in-up">{t.teamSubtitle}</p>
            <p className="text-textMuted mt-4">{t.teamLocation}</p>
          </motion.div>
          <div ref={teamRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {t.teamMembers.map((member, index) => (
              <div
                key={member}
                className="team-member glass-card rounded-2xl p-8 text-center hover:shadow-cinematic-glow hover:scale-105 transition-all duration-500 animate-depth-pulse interactive-element pulse-ring"
                style={{
                  animationDelay: `${index * 0.5}s`,
                  background: `linear-gradient(135deg, rgba(107, 159, 255, 0.1) 0%, rgba(127, 64, 255, 0.1) 50%, rgba(255, 127, 80, 0.1) 100%)`
                }}
              >
                <div className="text-4xl mb-4 animate-float animate-infinite-rotate" style={{animationDuration: '8s'}}>{member[0]}</div>
                <h3 className="text-xl font-semibold text-textPrimary animate-breathe">{member}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
export default Home;
