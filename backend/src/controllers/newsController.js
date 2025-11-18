const axios = require('axios');

const getEducationalNews = async (req, res) => {
  try {
    const apiKey = process.env.NEWS_API_KEY;

    // Try to fetch from NewsAPI.org first
    if (apiKey && apiKey !== 'your_newsapi_key_here') {
      try {
        const response = await axios.get('https://newsapi.org/v2/top-headlines', {
          params: {
            category: 'general',
            q: 'education OR college OR university OR student OR academic OR scholarship OR career',
            language: 'en',
            pageSize: 10,
            apiKey: apiKey
          }
        });

        if (response.data?.articles?.length > 0) {
          const articles = response.data.articles
            .filter(article => article.title && article.description && article.url)
            .map(article => ({
              id: article.url,
              title: article.title,
              description: article.description,
              url: article.url,
              imageUrl: article.urlToImage,
              source: article.source.name,
              publishedAt: article.publishedAt,
              author: article.author
            }));

          return res.json({
            success: true,
            articles: articles
          });
        }
      } catch (apiError) {
        // NewsAPI request failed, using mock data
      }
    }

    // Fallback to mock educational news
    const mockArticles = [
      {
        id: 'mock-1',
        title: 'New AI Tools Revolutionizing Online Learning',
        description: 'Educational institutions are adopting AI-powered platforms to enhance student learning experiences and provide personalized education.',
        url: 'https://example.com/ai-education',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        source: 'Tech Education Today',
        publishedAt: new Date().toISOString(),
        author: 'Sarah Johnson'
      },
      {
        id: 'mock-2',
        title: 'College Students Lead Climate Change Research',
        description: 'Undergraduate researchers at universities worldwide are making significant contributions to climate science and environmental solutions.',
        url: 'https://example.com/climate-research',
        imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400',
        source: 'Science Daily',
        publishedAt: new Date().toISOString(),
        author: 'Dr. Michael Chen'
      },
      {
        id: 'mock-3',
        title: 'Virtual Reality Transforms Medical Education',
        description: 'Medical students are using VR technology to practice complex procedures and gain hands-on experience in safe, controlled environments.',
        url: 'https://example.com/vr-medicine',
        imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
        source: 'Medical Education Journal',
        publishedAt: new Date().toISOString(),
        author: 'Prof. Lisa Rodriguez'
      },
      {
        id: 'mock-4',
        title: 'Blockchain Technology in Academic Credentials',
        description: 'Universities are exploring blockchain solutions to verify degrees and certificates, making academic achievements more secure and portable.',
        url: 'https://example.com/blockchain-credentials',
        imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400',
        source: 'Education Technology Review',
        publishedAt: new Date().toISOString(),
        author: 'James Wilson'
      },
      {
        id: 'mock-5',
        title: 'Mental Health Support Programs Expand on Campuses',
        description: 'Colleges nationwide are increasing mental health resources and support services to help students navigate academic and personal challenges.',
        url: 'https://example.com/mental-health-campus',
        imageUrl: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400',
        source: 'Student Wellness Magazine',
        publishedAt: new Date().toISOString(),
        author: 'Dr. Amanda Foster'
      },
      {
        id: 'mock-6',
        title: 'Coding Bootcamps Bridge Skills Gap for Graduates',
        description: 'Intensive coding programs are helping recent graduates acquire in-demand technical skills and transition into tech careers.',
        url: 'https://example.com/coding-bootcamps',
        imageUrl: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400',
        source: 'Career Development News',
        publishedAt: new Date().toISOString(),
        author: 'Mark Thompson'
      }
    ];


    res.json({
      success: true,
      articles: mockArticles
    });
  } catch (error) {
    console.error('Error in educational news endpoint:', error);
    res.status(500).json({ error: 'Failed to fetch educational news' });
  }
};

module.exports = {
  getEducationalNews
};