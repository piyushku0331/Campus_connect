import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Newspaper, ExternalLink, Clock, User, TrendingUp } from 'lucide-react';
import { newsAPI } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';

const News = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All News', icon: Newspaper },
    { id: 'education', name: 'Education', icon: User },
    { id: 'technology', name: 'Technology', icon: TrendingUp },
    { id: 'science', name: 'Science', icon: TrendingUp },
    { id: 'career', name: 'Career', icon: User },
  ];

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await newsAPI.getEducationalNews();
      let articles = response.data.articles || [];

      // Filter by category if not 'all'
      if (selectedCategory !== 'all') {
        articles = articles.filter(article =>
          article.title?.toLowerCase().includes(selectedCategory) ||
          article.description?.toLowerCase().includes(selectedCategory) ||
          article.content?.toLowerCase().includes(selectedCategory)
        );
      }

      setNewsArticles(articles);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Failed to load news articles');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const NewsCard = ({ article, index }) => (
    <div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 animate-slide-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {article.urlToImage && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {article.source?.name || 'News'}
            </span>
          </div>
        </div>
      )}

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
          {article.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {article.description || article.content?.substring(0, 150) + '...'}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            {article.author && (
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
            )}
          </div>
        </div>

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          <span>Read Full Article</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );

  // PropTypes validation for NewsCard
  NewsCard.propTypes = {
    article: PropTypes.shape({
      url: PropTypes.string,
      urlToImage: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      content: PropTypes.string,
      publishedAt: PropTypes.string,
      author: PropTypes.string,
      source: PropTypes.shape({
        name: PropTypes.string
      })
    }).isRequired,
    index: PropTypes.number.isRequired
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center space-x-3 mb-4">
            <Newspaper className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Educational News
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Stay informed with the latest educational news, research, and trends from around the world
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex space-x-2 overflow-x-auto">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : newsArticles.length > 0 ? (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {newsArticles.map((article, index) => (
                <NewsCard key={article.url || index} article={article} index={index} />
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-12">
              <button
                onClick={fetchNews}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors duration-200"
              >
                Load More Articles
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No articles found
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Try selecting a different category or check back later for new articles.
            </p>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {newsArticles.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Articles Available
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 mb-2">
                24/7
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Updated Daily
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600 mb-2">
                Global
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Worldwide Coverage
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;