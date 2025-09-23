import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../assets/styles/pages/AlumniStoryPage.css';

const AlumniStoryPage = () => {
  const { id } = useParams();

  // Mock data - replace with API calls
  const alumniStories = {
    1: {
      id: 1,
      name: 'Jane Doe',
      company: 'TechCorp',
      role: 'Software Engineer',
      year: 2025,
      avatar: '👩‍💻',
      story: `My placement journey at TechCorp has been an exciting chapter in my college life. As a final year computer science student, I focused on building practical skills through internships and projects.

      During my third year, I interned at a local startup where I learned the importance of agile development and team collaboration. This experience helped me secure my current position at TechCorp, a leading tech company known for innovation.

      What helped me succeed:
      • Consistent participation in coding competitions
      • Building a strong portfolio of projects
      • Active involvement in technical clubs
      • Developing soft skills through group activities
      • Seeking mentorship from seniors

      The placement process taught me that preparation is key. Start early, build your skills continuously, and don't underestimate the power of networking within your college community.`,
      achievements: [
        'Secured placement with 12 LPA package',
        'Won 2nd place in inter-college hackathon',
        'Completed 3 internships during college',
        'Led technical workshop for juniors'
      ],
      advice: 'Success in placements comes from consistent effort and genuine passion for technology. Focus on learning, not just grades.'
    },
    2: {
      id: 2,
      name: 'John Smith',
      company: 'Innovate LLC',
      role: 'Data Analyst',
      year: 2025,
      avatar: '👨‍🔬',
      story: `My path to becoming a Data Analyst at Innovate LLC was filled with curiosity and determination. What started as an interest in mathematics during my first year evolved into a passion for data science.

      I began by taking elective courses in statistics and machine learning, then joined the data science club where I learned about real-world applications. My breakthrough came when I worked on a college research project analyzing student performance data, which caught the attention of Innovate LLC recruiters.

      Key factors in my success:
      • Developing strong analytical thinking
      • Learning Python, R, and SQL through self-study
      • Participating in data science competitions
      • Building a GitHub portfolio with data projects
      • Networking with industry professionals

      The placement season was intense, but the preparation made all the difference. I learned that data analysis is about storytelling with numbers.`,
      achievements: [
        'Placed with competitive salary package',
        'Published data analysis project in college journal',
        'Completed Google Data Analytics certification',
        'Mentored juniors in data science basics'
      ],
      advice: 'Data is everywhere. Learn to extract insights from it, and you will always find opportunities. Start with curiosity, end with impact.'
    },
    3: {
      id: 3,
      name: 'Emily White',
      company: 'Google',
      role: 'Product Manager',
      year: 2024,
      avatar: '👩‍💼',
      story: `My journey from campus to Google has been nothing short of incredible. As a computer science student, I never imagined I'd be leading product teams at one of the world's most innovative companies.

      It all started during my sophomore year when I joined the product design club. The hands-on experience with user research and prototyping gave me the foundation I needed. I interned at Google during my junior year, and that experience opened my eyes to the possibilities in product management.

      The key lessons I learned:
      • Always put users first in your decision-making
      • Embrace failure as a learning opportunity
      • Build strong relationships across teams
      • Never stop learning and adapting

      To current students: focus on building real projects, network genuinely, and don't be afraid to take calculated risks. Your campus experience is more valuable than you think!`,
      achievements: [
        'Led product launch that increased user engagement by 40%',
        'Mentored 15+ junior PMs',
        'Published research on AI ethics in product design',
        'Spoke at 3 international conferences'
      ],
      advice: 'The best way to predict the future is to create it. Start small, think big, and never stop learning.'
    },
    4: {
      id: 4,
      name: 'Alice Brown',
      company: 'StartupXYZ',
      role: 'UX Designer',
      year: 2025,
      avatar: '👩‍🎨',
      story: `My journey into UX design began with a simple sketch in my notebook. As someone who loved both technology and creativity, I found the perfect blend in user experience design.

      During my second year, I discovered UI/UX through an elective course and immediately fell in love. I started designing interfaces for college projects and joined the design club. My big break came when I redesigned the college app, which impressed StartupXYZ recruiters during the placement drive.

      What made the difference:
      • Building a design portfolio from day one
      • Learning design tools like Figma and Adobe XD
      • Understanding user research methodologies
      • Participating in design challenges and competitions
      • Seeking feedback from peers and mentors

      The placement process taught me that design is about solving real problems for real people. Every pixel matters, and every user deserves an amazing experience.`,
      achievements: [
        'Secured placement with innovative startup',
        'Won design challenge at state level competition',
        'Redesigned college mobile app interface',
        'Created design system for student organizations'
      ],
      advice: 'Design is empathy in action. Understand your users deeply, and your designs will speak for themselves.'
    },
    5: {
      id: 5,
      name: 'Bob Wilson',
      company: 'BigTech Inc',
      role: 'DevOps Engineer',
      year: 2025,
      avatar: '👨‍🔧',
      story: `My DevOps journey started with a curiosity about how applications get deployed and scaled. What began as tinkering with servers turned into a career at BigTech Inc.

      During my third year, I volunteered to manage the college's server infrastructure. This hands-on experience taught me about automation, monitoring, and reliability. I learned Docker, Kubernetes, and CI/CD pipelines through personal projects and online courses.

      The turning point was when I automated the college's deployment process, which caught BigTech's attention during campus recruitment. They were impressed by my practical experience and problem-solving approach.

      Key milestones:
      • Setting up automated deployment pipelines
      • Implementing monitoring and logging systems
      • Learning cloud platforms (AWS, Azure)
      • Contributing to infrastructure as code projects
      • Building disaster recovery solutions

      DevOps taught me that technology should serve people, not the other way around. It's about making complex systems simple and reliable.`,
      achievements: [
        'Placed at leading technology company',
        'Automated college infrastructure deployment',
        'Achieved AWS Solutions Architect certification',
        'Built monitoring system for student projects'
      ],
      advice: 'DevOps is about culture as much as technology. Focus on collaboration, automation, and continuous improvement.'
    },
    6: {
      id: 6,
      name: 'David Chen',
      company: 'Microsoft',
      role: 'Senior Developer',
      year: 2023,
      avatar: '👨‍💻',
      story: `From debugging my first "Hello World" program to leading development teams at Microsoft – what a journey it's been!

      My college experience taught me that success isn't just about grades; it's about passion, persistence, and the ability to learn from failure. I started as a curious freshman who loved solving problems, and through consistent effort and the guidance of amazing professors, I grew into a confident developer.

      The turning point came when I contributed to an open-source project that caught Microsoft's attention. That led to an internship, then a full-time offer, and now I'm helping shape the future of cloud computing.

      My advice to students:
      • Code every day, even if it's just for 30 minutes
      • Contribute to open-source projects
      • Learn to explain complex concepts simply
      • Build a strong foundation in computer science fundamentals
      • Network with professionals, but focus on genuine connections

      Remember: every expert was once a beginner. Your journey starts with that first line of code.`,
      achievements: [
        'Led development of Azure service used by 10M+ users',
        'Open-source contributor with 50+ merged PRs',
        'Microsoft MVP (Most Valuable Professional)',
        'Published 12 technical articles'
      ],
      advice: 'The only way to do great work is to love what you do. Find your passion and pursue it relentlessly.'
    }
  };

  const story = alumniStories[id];

  if (!story) {
    return (
      <div className="alumni-story-page">
        <div className="story-not-found">
          <h1>Story Not Found</h1>
          <p>The alumni story you're looking for doesn't exist.</p>
          <Link to="/placements" className="back-link">← Back to Placements</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="alumni-story-page">
      <div className="story-header">
        <Link to="/placements" className="back-link">← Back to Placements</Link>
        <div className="story-hero">
          <div className="story-avatar">{story.avatar}</div>
          <div className="story-intro">
            <h1>{story.name}</h1>
            <p className="story-role">{story.role} at {story.company}</p>
            <p className="story-year">Class of {story.year}</p>
          </div>
        </div>
      </div>

      <div className="story-content">
        <section className="story-section">
          <h2>The Journey</h2>
          <div className="story-text">
            {story.story.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="story-section">
          <h2>Key Achievements</h2>
          <ul className="achievements-list">
            {story.achievements.map((achievement, index) => (
              <li key={index}>{achievement}</li>
            ))}
          </ul>
        </section>

        <section className="story-section">
          <h2>Final Words</h2>
          <blockquote className="advice-quote">
            "{story.advice}"
          </blockquote>
        </section>

        <div className="story-actions">
          <Link to="/placements" className="btn btn-primary">Explore More Stories</Link>
          <Link to="/contact" className="btn btn-secondary">Get in Touch</Link>
        </div>
      </div>
    </div>
  );
};

export default AlumniStoryPage;