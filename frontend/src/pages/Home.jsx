import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Leaderboard from '../components/gamification/Leaderboard';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
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
const Home = React.memo(() => {
  const heroRef = useParallax(0.3);
  const featuresRef = useRef(null);
  const teamRef = useRef(null);
  
  const parallaxRef1 = useParallax(0.2);
  const parallaxRef2 = useParallax(0.4);
  const parallaxRef3 = useParallax(0.1);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Computer Science Student",
      university: "MIT",
      content: "Campus Connect transformed my college experience. I made connections that led to amazing internship opportunities and lifelong friendships.",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Engineering Student",
      university: "Stanford",
      content: "The gamification system keeps me motivated to participate in campus activities. Earning points and unlocking achievements is addictive!",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Emma Rodriguez",
      role: "Business Student",
      university: "Harvard",
      content: "Finding study groups and sharing resources has never been easier. Campus Connect made my academic journey so much more collaborative.",
      rating: 5,
      avatar: "ER"
    },
    {
      name: "David Kim",
      role: "Medical Student",
      university: "Johns Hopkins",
      content: "The events feature helped me discover so many amazing campus activities I would have otherwise missed. Highly recommend!",
      rating: 5,
      avatar: "DK"
    },
    {
      name: "Lisa Wang",
      role: "Design Student",
      university: "RISD",
      content: "As an international student, Campus Connect helped me feel connected to my university community from day one. The networking features are incredible.",
      rating: 5,
      avatar: "LW"
    },
    {
      name: "Alex Thompson",
      role: "Physics Student",
      university: "Caltech",
      content: "The leaderboard system adds a fun competitive element to campus life. It's motivating to see how active everyone is!",
      rating: 5,
      avatar: "AT"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change testimonial every 5 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);
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

  }, []);
  return (
    <div className="min-h-screen flex flex-col floating-particles floating-particles-enhanced dynamic-bg-elements depth-layer-1 relative overflow-hidden">
      {/* Enhanced ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-primary/10 via-secondary/5 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-radial from-secondary/8 via-primary/4 to-transparent rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-radial from-accent/6 via-transparent to-transparent rounded-full blur-2xl animate-pulse-slow animation-delay-4000"></div>
      </div>
      {}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden depth-layer-2">
        <div ref={heroRef} className="absolute inset-0 bg-hero-bg bg-cover bg-center parallax-element"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/75 to-black/85"></div>
        <div className="absolute inset-0 bg-ambient-overlay animate-breathe"></div>
        {/* Enhanced floating orbs with better positioning and effects */}
        <div ref={parallaxRef1} className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-primary/40 via-secondary/30 to-accent/20 rounded-full blur-2xl animate-parallax-float opacity-60 shadow-2xl"></div>
        <div ref={parallaxRef2} className="absolute bottom-32 right-16 w-32 h-32 bg-gradient-to-br from-secondary/35 via-primary/25 to-accent/15 rounded-full blur-xl animate-parallax-float opacity-50 shadow-xl" style={{ animationDelay: '1s' }}></div>
        <div ref={parallaxRef3} className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-accent/30 via-primary/20 to-secondary/10 rounded-full blur-lg animate-parallax-float opacity-40 shadow-lg" style={{ animationDelay: '2s' }}></div>
        {/* Additional ambient orbs for depth */}
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-gradient-to-br from-primary/25 via-transparent to-secondary/15 rounded-full blur-md animate-float opacity-30"></div>
        <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-gradient-to-br from-secondary/20 via-accent/15 to-primary/10 rounded-full blur-lg animate-float opacity-25" style={{ animationDelay: '3s' }}></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center depth-layer-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight mb-4 sm:mb-6 cinematic-heading max-w-4xl mx-auto">
              <span className="bg-gradient-to-r from-white via-primary/90 to-secondary/90 bg-clip-text text-transparent animate-gradient-x">
                {t.welcome}
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-textMuted max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-12 animate-fade-in-up px-4 relative z-10">
              {t.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-lg mx-auto">
              <Link
                to="/signup"
                className="bg-gradient-to-r glass-effect border border-primary/30 from-primary hover:border-primary/60 to-secondary text-white font-medium px-8 py-3 rounded-full hover:shadow-cinematic-glow hover:scale-105 transition-all duration-500 interactive-element relative overflow-hidden group"
              >
                <span className="relative z-10">{t.signUp}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                to="/login"
                className="glass-effect border border-primary/30 text-primary hover:border-primary/60 px-8 py-3 rounded-full font-medium hover:bg-primary/10 transition-all duration-500 animate-shimmer interactive-element relative overflow-hidden group"
              >
                <span className="relative z-10">{t.getStarted}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
          <div ref={featuresRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            <div className="feature-card glass-card rounded-2xl p-8 hover:shadow-cinematic-glow hover:scale-105 transition-all duration-500 animate-depth-pulse interactive-element animate-wave-motion relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                '--glow-x': '50%',
                '--glow-y': '50%',
                '--glow-intensity': '0',
                '--glow-radius': '200px',
                '--glow-color': '132, 0, 255'
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                e.currentTarget.style.setProperty('--glow-x', `${x}%`);
                e.currentTarget.style.setProperty('--glow-y', `${y}%`);
                e.currentTarget.style.setProperty('--glow-intensity', '0.3');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.setProperty('--glow-intensity', '0');
              }}
            >
              <div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(132, 0, 255, 0.1) 0%, transparent 70%)',
                  borderRadius: 'inherit'
                }}
              />
              <div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(132, 0, 255, 0.1) 0%, transparent 70%)',
                  borderRadius: 'inherit'
                }}
              />
              <div className="text-4xl mb-4 animate-float animate-color-shift relative z-10">{t.earnPoints.split(' ')[0]}</div>
              <h3 className="text-xl font-semibold text-textPrimary mb-3 relative z-10">{t.earnPoints}</h3>
              <p className="text-textMuted leading-relaxed relative z-10">{t.earnPointsDesc}</p>
            </div>
            <div className="feature-card glass-card rounded-2xl p-8 hover:shadow-cinematic-glow hover:scale-105 transition-all duration-500 animate-depth-pulse interactive-element animate-morphing-blob relative overflow-hidden group"
              style={{
                animationDelay: '2s',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.15), 0 0 20px rgba(127, 64, 255, 0.1)',
                '--glow-x': '50%',
                '--glow-y': '50%',
                '--glow-intensity': '0',
                '--glow-radius': '250px',
                '--glow-color': '127, 64, 255'
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                e.currentTarget.style.setProperty('--glow-x', `${x}%`);
                e.currentTarget.style.setProperty('--glow-y', `${y}%`);
                e.currentTarget.style.setProperty('--glow-intensity', '0.3');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.setProperty('--glow-intensity', '0');
              }}
            >
              <div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(132, 0, 255, 0.1) 0%, transparent 70%)',
                  borderRadius: 'inherit'
                }}
              />
              <div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(132, 0, 255, 0.1) 0%, transparent 70%)',
                  borderRadius: 'inherit'
                }}
              />
              <div className="text-4xl mb-4 animate-float animate-color-shift relative z-10" style={{animationDelay: '0.5s'}}>{t.climbLeaderboard.split(' ')[0]}</div>
              <h3 className="text-xl font-semibold text-textPrimary mb-3 relative z-10">{t.climbLeaderboard}</h3>
              <p className="text-textMuted leading-relaxed relative z-10">{t.climbLeaderboardDesc}</p>
            </div>
            <div className="feature-card glass-card rounded-2xl p-8 hover:shadow-cinematic-glow hover:scale-105 transition-all duration-500 animate-depth-pulse interactive-element animate-floating-shapes relative overflow-hidden group"
              style={{
                animationDelay: '4s',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.15), 0 0 20px rgba(255, 127, 80, 0.1)',
                '--glow-x': '50%',
                '--glow-y': '50%',
                '--glow-intensity': '0',
                '--glow-radius': '250px',
                '--glow-color': '255, 127, 80'
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                e.currentTarget.style.setProperty('--glow-x', `${x}%`);
                e.currentTarget.style.setProperty('--glow-y', `${y}%`);
                e.currentTarget.style.setProperty('--glow-intensity', '0.3');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.setProperty('--glow-intensity', '0');
              }}
            >
              <div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(132, 0, 255, 0.1) 0%, transparent 70%)',
                  borderRadius: 'inherit'
                }}
              />
              <div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(132, 0, 255, 0.1) 0%, transparent 70%)',
                  borderRadius: 'inherit'
                }}
              />
              <div className="text-4xl mb-4 animate-float animate-color-shift relative z-10" style={{animationDelay: '1s'}}>{t.unlockAchievements.split(' ')[0]}</div>
              <h3 className="text-xl font-semibold text-textPrimary mb-3 relative z-10">{t.unlockAchievements}</h3>
              <p className="text-textMuted leading-relaxed relative z-10">{t.unlockAchievementsDesc}</p>
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
            <h2 className="text-4xl font-semibold text-textPrimary mb-4 cinematic-heading">Features Showcase</h2>
            <p className="text-textMuted max-w-2xl mx-auto animate-fade-in-up">Explore the powerful features of Campus Connect</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 mt-16">
              <div className="feature-card glass-card rounded-2xl p-8 hover:shadow-cinematic-glow hover:scale-105 transition-all duration-500 animate-depth-pulse interactive-element animate-wave-motion relative overflow-hidden group"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15), 0 0 20px rgba(107, 159, 255, 0.1)',
                  '--glow-x': '50%',
                  '--glow-y': '50%',
                  '--glow-intensity': '0',
                  '--glow-radius': '250px',
                  '--glow-color': '107, 159, 255'
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  e.currentTarget.style.setProperty('--glow-x', `${x}%`);
                  e.currentTarget.style.setProperty('--glow-y', `${y}%`);
                  e.currentTarget.style.setProperty('--glow-intensity', '0.3');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.setProperty('--glow-intensity', '0');
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(132, 0, 255, 0.1) 0%, transparent 70%)',
                    borderRadius: 'inherit'
                  }}
                />
                <div className="text-4xl mb-4 animate-float animate-color-shift relative z-10">🤝</div>
                <h3 className="text-xl font-semibold text-textPrimary mb-3 relative z-10">Networking</h3>
                <p className="text-textMuted leading-relaxed relative z-10">Connect with fellow students, alumni, and professionals in your field.</p>
                  {t.getStarted}
              </div>
              <div className="feature-card glass-card rounded-2xl p-8 hover:shadow-cinematic-glow hover:scale-105 transition-all duration-500 animate-depth-pulse interactive-element animate-wave-motion relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  '--glow-x': '50%',
                  '--glow-y': '50%',
                  '--glow-intensity': '0',
                  '--glow-radius': '200px',
                  '--glow-color': '132, 0, 255'
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  e.currentTarget.style.setProperty('--glow-x', `${x}%`);
                  e.currentTarget.style.setProperty('--glow-y', `${y}%`);
                  e.currentTarget.style.setProperty('--glow-intensity', '0.3');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.setProperty('--glow-intensity', '0');
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(132, 0, 255, 0.1) 0%, transparent 70%)',
                    borderRadius: 'inherit'
                  }}
                />
                <div className="text-4xl mb-4 animate-float animate-color-shift relative z-10">📅</div>
                <h3 className="text-xl font-semibold text-textPrimary mb-3 relative z-10">Events</h3>
                <p className="text-textMuted leading-relaxed relative z-10">Discover and participate in campus events, workshops, and activities.</p>
              </div>
              <div className="feature-card glass-card rounded-2xl p-8 hover:shadow-cinematic-glow hover:scale-105 transition-all duration-500 animate-depth-pulse interactive-element animate-wave-motion relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  '--glow-x': '50%',
                  '--glow-y': '50%',
                  '--glow-intensity': '0',
                  '--glow-radius': '200px',
                  '--glow-color': '132, 0, 255'
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  e.currentTarget.style.setProperty('--glow-x', `${x}%`);
                  e.currentTarget.style.setProperty('--glow-y', `${y}%`);
                  e.currentTarget.style.setProperty('--glow-intensity', '0.3');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.setProperty('--glow-intensity', '0');
                }}
              >
                <div className="text-4xl mb-4 animate-float animate-color-shift relative z-10">📚</div>
                <h3 className="text-xl font-semibold text-textPrimary mb-3 relative z-10">Resources</h3>
                <p className="text-textMuted leading-relaxed relative z-10">Access study materials, notes, and educational resources shared by peers.</p>
              </div>
            </div>
          </motion.div>
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
          <div ref={teamRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
            {t.teamMembers.map((member) => (
              <div
                key={member}
                className="team-member glass-card rounded-2xl p-8 text-center hover:shadow-cinematic-glow hover:scale-105 transition-all duration-500 overflow-hidden group cursor-pointer interactive-element"
                style={{
                  background: `linear-gradient(135deg, rgba(107, 159, 255, 0.1) 0%, rgba(127, 64, 255, 0.1) 50%, rgba(255, 127, 80, 0.1) 100%)`,
                  '--glow-x': '50%',
                  '--glow-y': '50%',
                  '--glow-intensity': '0',
                  '--glow-radius': '200px',
                  '--glow-color': '107, 159, 255'
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  e.currentTarget.style.setProperty('--glow-x', `${x}%`);
                  e.currentTarget.style.setProperty('--glow-y', `${y}%`);
                  e.currentTarget.style.setProperty('--glow-intensity', '0.3');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.setProperty('--glow-intensity', '0');
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(107, 159, 255, 0.1) 0%, transparent 70%)',
                    borderRadius: 'inherit'
                  }}
                />
                <div className="relative overflow-hidden z-10">
                  <div className="transform transition-transform duration-500 ease-out group-hover:translate-y-[-100%]">
                    <div className="text-4xl mb-4">{member[0]}</div>
                    <h3 className="text-xl font-semibold text-textPrimary">{member}</h3>
                  </div>
                  <div className="absolute inset-0 transform translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0 flex flex-col items-center justify-center">
                    <div className="text-2xl mb-2">👋</div>
                    <h3 className="text-xl font-semibold text-primary">Hello!</h3>
                    <p className="text-sm text-textMuted mt-1">Nice to meet you</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {}
      <section className="py-20 md:py-28 relative">
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
            <h2 className="text-4xl font-semibold text-textPrimary mb-4 cinematic-heading">What Students Say</h2>
            <p className="text-textMuted max-w-2xl mx-auto animate-fade-in-up">Hear from students who are already part of our community</p>
          </motion.div>

          <div className="relative overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}>
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-5xl mx-auto"
                  >
                    <div className="glass-card rounded-2xl p-8 md:p-12 text-center relative max-w-4xl mx-auto">
                      <Quote className="w-12 h-12 text-primary/30 mx-auto mb-6" />
                      <blockquote className="text-lg md:text-xl text-textPrimary mb-8 leading-relaxed italic">
                        &ldquo;{testimonial.content}&rdquo;
                      </blockquote>

                      <div className="flex items-center justify-center mb-6">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>

                      <div className="flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-xl mb-3 mx-auto">
                            {testimonial.avatar}
                          </div>
                          <h4 className="text-lg font-semibold text-textPrimary">{testimonial.name}</h4>
                          <p className="text-textMuted">{testimonial.role}</p>
                          <p className="text-primary text-sm">{testimonial.university}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-primary scale-125' : 'bg-textMuted/50 hover:bg-textMuted'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
});

Home.displayName = 'Home';

export default Home;
