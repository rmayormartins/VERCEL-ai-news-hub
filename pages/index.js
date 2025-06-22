import React, { useState, useEffect, useMemo } from 'react';
import { Search, Calendar, Mail, Filter, Clock, TrendingUp, BookOpen, Send, ChevronDown, ChevronUp, BarChart3, Users, FileText, Eye, ExternalLink, MailX } from 'lucide-react';

const AINewsApp = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('day');
  const [selectedTheme, setSelectedTheme] = useState('all');
  const [email, setEmail] = useState('');
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [latestNews, setLatestNews] = useState([]);
  const [topNews, setTopNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  // Control how many items to show
  const [latestNewsCount, setLatestNewsCount] = useState(6);
  const [topNewsCount, setTopNewsCount] = useState(6);
  const [filteredNewsCount, setFilteredNewsCount] = useState(6);

  // Mock data - In production, these will be real API calls
  const mockLatestNews = [
    {
      id: 1,
      title: "OpenAI Launches New GPT Version with Enhanced Capabilities",
      description: "The latest update promises better contextual understanding and reduced hallucinations.",
      source: "TechCrunch",
      publishedAt: "2025-06-22T10:30:00Z",
      url: "#",
      category: "machine-learning"
    },
    {
      id: 2,
      title: "Google DeepMind Develops AI that Predicts Climate Change",
      description: "New model can predict climate patterns with 95% accuracy.",
      source: "Nature",
      publishedAt: "2025-06-22T08:15:00Z",
      url: "#",
      category: "research"
    },
    {
      id: 3,
      title: "Brazilian Startup Creates AI for Medical Diagnosis",
      description: "Technology promises to revolutionize cancer diagnosis in Brazil.",
      source: "Reuters",
      publishedAt: "2025-06-22T06:45:00Z",
      url: "#",
      category: "healthcare"
    },
    {
      id: 4,
      title: "Microsoft Integrates Advanced AI into Office Suite",
      description: "Copilot gets major upgrade with multimodal capabilities.",
      source: "The Verge",
      publishedAt: "2025-06-22T05:30:00Z",
      url: "#",
      category: "business"
    },
    {
      id: 5,
      title: "New AI Model Achieves Human-Level Performance in Coding",
      description: "Revolutionary breakthrough in automated software development.",
      source: "MIT Technology Review",
      publishedAt: "2025-06-22T04:15:00Z",
      url: "#",
      category: "machine-learning"
    },
    {
      id: 6,
      title: "AI-Powered Robot Performs Complex Surgery Successfully",
      description: "First fully autonomous surgical procedure completed.",
      source: "Science Daily",
      publishedAt: "2025-06-22T03:00:00Z",
      url: "#",
      category: "healthcare"
    },
    {
      id: 7,
      title: "Quantum AI Computer Solves Protein Folding in Minutes",
      description: "Breakthrough could accelerate drug discovery significantly.",
      source: "Nature",
      publishedAt: "2025-06-22T02:30:00Z",
      url: "#",
      category: "research"
    },
    {
      id: 8,
      title: "EU Announces $100B Investment in AI Infrastructure",
      description: "Massive funding to compete with US and China in AI race.",
      source: "Financial Times",
      publishedAt: "2025-06-22T01:45:00Z",
      url: "#",
      category: "regulation"
    },
    {
      id: 17,
      title: "Pentagon Deploys AI-Powered Defense Systems",
      description: "Military unveils autonomous defense network capable of real-time threat detection.",
      source: "Defense News",
      publishedAt: "2025-06-22T01:30:00Z",
      url: "#",
      category: "defense"
    },
    {
      id: 18,
      title: "5G Networks Enhanced with AI for Smart Cities",
      description: "Telecommunications giants partner to deploy AI-optimized network infrastructure.",
      source: "Telecom World",
      publishedAt: "2025-06-22T01:15:00Z",
      url: "#",
      category: "telecommunications"
    }
  ];

  const mockTopNews = [
    {
      id: 9,
      title: "Meta Invests $50 Billion in AI Infrastructure",
      description: "Largest investment in company history for AI data centers.",
      source: "Reuters",
      publishedAt: "2025-06-20T14:20:00Z",
      url: "#",
      category: "business",
      views: 2500000
    },
    {
      id: 10,
      title: "Autonomous AI Solves 100-Year-Old Mathematical Problem",
      description: "System developed by university solves conjecture considered impossible.",
      source: "Science",
      publishedAt: "2025-06-19T11:30:00Z",
      url: "#",
      category: "research",
      views: 1800000
    },
    {
      id: 11,
      title: "EU AI Regulation Comes into Effect",
      description: "New European law establishes strict rules for artificial intelligence use.",
      source: "BBC",
      publishedAt: "2025-06-18T16:45:00Z",
      url: "#",
      category: "regulation",
      views: 1200000
    },
    {
      id: 12,
      title: "ChatGPT Reaches 1 Billion Active Users",
      description: "Historic milestone for OpenAI's flagship product.",
      source: "TechCrunch",
      publishedAt: "2025-06-17T13:20:00Z",
      url: "#",
      category: "business",
      views: 3200000
    },
    {
      id: 13,
      title: "AI Discovers New Antibiotic in Hours",
      description: "Machine learning identifies potential cure for drug-resistant bacteria.",
      source: "Cell",
      publishedAt: "2025-06-16T09:15:00Z",
      url: "#",
      category: "healthcare",
      views: 1900000
    },
    {
      id: 14,
      title: "Tesla's Full Self-Driving Achieves Level 5 Autonomy",
      description: "Major breakthrough in autonomous vehicle technology.",
      source: "Electrek",
      publishedAt: "2025-06-15T15:30:00Z",
      url: "#",
      category: "robotics",
      views: 2800000
    },
    {
      id: 15,
      title: "AI Tutoring System Improves Student Scores by 40%",
      description: "Personalized learning platform shows remarkable results.",
      source: "Education Week",
      publishedAt: "2025-06-14T11:45:00Z",
      url: "#",
      category: "education",
      views: 1500000
    },
    {
      id: 16,
      title: "Nvidia Unveils Next-Generation AI Chips",
      description: "New architecture promises 10x performance improvement.",
      source: "AnandTech",
      publishedAt: "2025-06-13T08:20:00Z",
      url: "#",
      category: "hardware",
      views: 2100000
    },
    {
      id: 19,
      title: "AI-Powered Cybersecurity Prevents Major Attack",
      description: "Military-grade AI system successfully defends against state-sponsored cyber threat.",
      source: "CyberScoop",
      publishedAt: "2025-06-12T14:30:00Z",
      url: "#",
      category: "defense",
      views: 1750000
    },
    {
      id: 20,
      title: "Telecom AI Reduces Network Latency by 70%",
      description: "Revolutionary AI optimization transforms global telecommunications infrastructure.",
      source: "Network World",
      publishedAt: "2025-06-11T16:45:00Z",
      url: "#",
      category: "telecommunications",
      views: 1650000
    }
  ];

  const themes = [
    { value: 'all', label: 'All Topics' },
    { value: 'machine-learning', label: 'Machine Learning' },
    { value: 'research', label: 'Research' },
    { value: 'business', label: 'Business' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'regulation', label: 'Regulation' },
    { value: 'robotics', label: 'Robotics' },
    { value: 'ethics', label: 'AI Ethics' },
    { value: 'education', label: 'Education' },
    { value: 'hardware', label: 'Hardware' },
    { value: 'defense', label: 'Defense' },
    { value: 'telecommunications', label: 'Telecommunications' }
  ];

  const timeframes = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: '5months', label: 'Last 5 Months' }
  ];

  // Search functionality
  const filteredLatestNews = useMemo(() => {
    if (!searchQuery) return latestNews;
    return latestNews.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.source.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [latestNews, searchQuery]);

  const filteredTopNews = useMemo(() => {
    if (!searchQuery) return topNews;
    return topNews.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.source.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [topNews, searchQuery]);

  const searchFilteredNews = useMemo(() => {
    if (!searchQuery) return filteredNews;
    return filteredNews.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.source.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [filteredNews, searchQuery]);

  // Analytics calculations
  const analytics = useMemo(() => {
    const allNews = [...latestNews, ...topNews];
    const sources = [...new Set(allNews.map(article => article.source))];
    const categories = [...new Set(allNews.map(article => article.category))];
    const totalViews = topNews.reduce((sum, article) => sum + (article.views || 0), 0);
    
    const categoryStats = categories.map(category => ({
      name: themes.find(t => t.value === category)?.label || category,
      count: allNews.filter(article => article.category === category).length
    })).sort((a, b) => b.count - a.count);

    // API source statistics
    const apiStats = {};
    allNews.forEach(article => {
      const api = article.apiSource || 'Unknown';
      if (!apiStats[api]) {
        apiStats[api] = 0;
      }
      apiStats[api]++;
    });

    return {
      totalArticles: allNews.length,
      totalSources: sources.length,
      totalCategories: categories.length,
      totalViews,
      avgViewsPerArticle: Math.round(totalViews / topNews.length),
      topCategories: categoryStats.slice(0, 5),
      sources: sources.slice(0, 8),
      apiSources: Object.entries(apiStats).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
    };
  }, [latestNews, topNews]);

  useEffect(() => {
    // Load latest news
    fetch('/api/news/latest')
      .then(res => res.json())
      .then(data => setLatestNews(data.articles || mockLatestNews))
      .catch(() => setLatestNews(mockLatestNews));

    // Load top news
    fetch(`/api/news/top?timeframe=${selectedTimeframe}`)
      .then(res => res.json())
      .then(data => setTopNews(data.articles || mockTopNews))
      .catch(() => setTopNews(mockTopNews));
  }, [selectedTimeframe]);

  useEffect(() => {
    // Filter news by theme
    if (selectedTheme === 'all') {
      const allNews = [...latestNews, ...topNews];
      setFilteredNews(allNews);
    } else {
      fetch(`/api/news/filtered?theme=${selectedTheme}&timeframe=${selectedTimeframe}`)
        .then(res => res.json())
        .then(data => setFilteredNews(data.articles || []))
        .catch(() => {
          const allNews = [...latestNews, ...topNews];
          setFilteredNews(allNews.filter(news => news.category === selectedTheme));
        });
    }
    // Reset count when theme changes
    setFilteredNewsCount(6);
  }, [selectedTheme, latestNews, topNews, selectedTimeframe]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEmailSubscription = async () => {
    if (email) {
      try {
        const response = await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        
        if (response.ok) {
          setEmailSubscribed(true);
        } else {
          alert('Error subscribing email. Please try again.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error subscribing email. Please try again.');
      }
    }
  };

  const handleEmailUnsubscribe = async () => {
    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        setEmailSubscribed(false);
        setEmail('');
      } else {
        alert('Error unsubscribing. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error unsubscribing. Please try again.');
    }
  };

  const NewsCard = ({ article, showViews = false }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between mb-3">
        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
          {article.source}
        </span>
        <span className="text-gray-500 text-sm">{formatDate(article.publishedAt)}</span>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
        {article.title}
      </h3>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {article.description}
      </p>
      
      <div className="flex items-center justify-between">
        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
          {themes.find(t => t.value === article.category)?.label || 'General'}
        </span>
        {showViews && (
          <span className="text-gray-500 text-xs flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            {article.views?.toLocaleString()} views
          </span>
        )}
      </div>
    </div>
  );

  const LoadMoreButton = ({ currentCount, totalCount, onLoadMore, section }) => {
    if (currentCount >= totalCount) return null;
    
    return (
      <div className="flex justify-center mt-8">
        <button
          onClick={onLoadMore}
          className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-colors duration-300 flex items-center space-x-2"
        >
          <span>Load More</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    );
  };

  const ShowLessButton = ({ initialCount, currentCount, onShowLess }) => {
    if (currentCount <= initialCount) return null;
    
    return (
      <div className="flex justify-center mt-8">
        <button
          onClick={onShowLess}
          className="bg-gray-100 text-gray-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-300 flex items-center space-x-2"
        >
          <span>Show Less</span>
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>
    );
  };

  const AnalyticsDashboard = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <BarChart3 className="w-6 h-6 mr-3 text-blue-600" />
          Analytics Dashboard
        </h3>
        <button
          onClick={() => setShowAnalytics(!showAnalytics)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          {showAnalytics ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {showAnalytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Articles</p>
                  <p className="text-2xl font-bold">{analytics.totalArticles}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">News Sources</p>
                  <p className="text-2xl font-bold">{analytics.totalSources}</p>
                </div>
                <Users className="w-8 h-8 text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Categories</p>
                  <p className="text-2xl font-bold">{analytics.totalCategories}</p>
                </div>
                <Filter className="w-8 h-8 text-purple-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Total Views</p>
                  <p className="text-2xl font-bold">{(analytics.totalViews / 1000000).toFixed(1)}M</p>
                </div>
                <Eye className="w-8 h-8 text-orange-200" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Top Categories</h4>
              <div className="space-y-2">
                {analytics.topCategories.map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{category.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${(category.count / analytics.totalArticles) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-6 text-right">{category.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">API Sources</h4>
              <div className="space-y-2">
                {(analytics.apiSources || []).map((apiSource, index) => (
                  <div key={apiSource.name} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{apiSource.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-12 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-green-600 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${(apiSource.count / analytics.totalArticles) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-6 text-right">{apiSource.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">News Publishers</h4>
              <div className="grid grid-cols-1 gap-2">
                {analytics.sources.map((source, index) => (
                  <div key={source} className="bg-gray-50 rounded px-3 py-2">
                    <span className="text-xs text-gray-700 font-medium">{source}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top identification bar */}
      <div className="bg-gray-200 border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-center text-sm text-gray-700">
            <span className="mr-2">Created by</span>
            <a 
              href="https://rmayormartins.github.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-blue-700 hover:text-blue-900 transition-colors flex items-center"
            >
              Ramon Mayor Martins
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
            <span className="mx-2">•</span>
            <span>Federal Institute of Santa Catarina</span>
            <span className="mx-2">•</span>
            <span>2025</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI News Hub</h1>
                <p className="text-sm text-gray-600">Your real-time AI news source</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                Last updated: {new Date().toLocaleTimeString('en-US')}
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="pb-6">
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search AI news articles..."
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Dashboard */}
        <AnalyticsDashboard />

        {/* Newsletter Subscription */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-semibold mb-2">📧 Weekly Digest</h2>
              <p className="text-blue-100">Get the top AI news delivered to your inbox every week</p>
            </div>
            
            {!emailSubscribed ? (
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-2 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  onClick={handleEmailSubscription}
                  className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Subscribe
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    ✓
                  </div>
                  <span>Successfully subscribed!</span>
                </div>
                <button
                  onClick={handleEmailUnsubscribe}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center"
                >
                  <MailX className="w-4 h-4 mr-2" />
                  Unsubscribe
                </button>
              </div>
            )}
          </div>
        </div>

        {searchQuery && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800">
              <strong>Search results for:</strong> "{searchQuery}" 
              <span className="ml-2 text-blue-600">
                ({filteredLatestNews.length + filteredTopNews.length + searchFilteredNews.length} articles found)
              </span>
            </p>
          </div>
        )}

        {/* Latest News */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Latest AI News</h2>
              {searchQuery && (
                <span className="text-sm text-gray-500">({filteredLatestNews.length} found)</span>
              )}
            </div>
            <button
              onClick={() => {
                // Refresh latest news
                fetch('/api/news/latest')
                  .then(res => res.json())
                  .then(data => {
                    setLatestNews(data.articles || mockLatestNews);
                    setLatestNewsCount(6); // Reset count
                  })
                  .catch(() => setLatestNews(mockLatestNews));
              }}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLatestNews.slice(0, latestNewsCount).map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
          
          {filteredLatestNews.length === 0 && searchQuery && (
            <div className="text-center py-8 text-gray-500">
              No latest news found for "{searchQuery}"
            </div>
          )}
          
          <LoadMoreButton
            currentCount={latestNewsCount}
            totalCount={filteredLatestNews.length}
            onLoadMore={() => setLatestNewsCount(prev => Math.min(prev + 6, filteredLatestNews.length))}
            section="latest"
          />
          
          <ShowLessButton
            initialCount={6}
            currentCount={latestNewsCount}
            onShowLess={() => setLatestNewsCount(6)}
          />
        </section>

        {/* Top News with Filters */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Top AI News</h2>
              {searchQuery && (
                <span className="text-sm text-gray-500">({filteredTopNews.length} found)</span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {timeframes.map((timeframe) => (
                    <option key={timeframe.value} value={timeframe.value}>
                      {timeframe.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopNews.slice(0, topNewsCount).map((article) => (
              <NewsCard key={article.id} article={article} showViews={true} />
            ))}
          </div>
          
          {filteredTopNews.length === 0 && searchQuery && (
            <div className="text-center py-8 text-gray-500">
              No top news found for "{searchQuery}"
            </div>
          )}
          
          <LoadMoreButton
            currentCount={topNewsCount}
            totalCount={filteredTopNews.length}
            onLoadMore={() => setTopNewsCount(prev => Math.min(prev + 6, filteredTopNews.length))}
            section="top"
          />
          
          <ShowLessButton
            initialCount={6}
            currentCount={topNewsCount}
            onShowLess={() => setTopNewsCount(6)}
          />
        </section>

        {/* Filter by Theme */}
        <section>
          <div className="flex items-center space-x-3 mb-6">
            <Filter className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Filter News by Topic</h2>
            {searchQuery && (
              <span className="text-sm text-gray-500">({searchFilteredNews.length} found)</span>
            )}
          </div>
          
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {themes.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => setSelectedTheme(theme.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedTheme === theme.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchFilteredNews.slice(0, filteredNewsCount).map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
          
          {searchFilteredNews.length === 0 && !searchQuery && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No news found for this topic</div>
              <p className="text-gray-500">Try selecting a different topic or time period</p>
            </div>
          )}

          {searchFilteredNews.length === 0 && searchQuery && (
            <div className="text-center py-8 text-gray-500">
              No filtered news found for "{searchQuery}"
            </div>
          )}
          
          <LoadMoreButton
            currentCount={filteredNewsCount}
            totalCount={searchFilteredNews.length}
            onLoadMore={() => setFilteredNewsCount(prev => Math.min(prev + 6, searchFilteredNews.length))}
            section="filtered"
          />
          
          <ShowLessButton
            initialCount={6}
            currentCount={filteredNewsCount}
            onShowLess={() => setFilteredNewsCount(6)}
          />
        </section>
      </div>

      {/* Footer */}
{/* Footer */}
<footer className="bg-white border-t mt-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="text-center text-gray-600">
      <p>© 2025 AI News Hub. Created by Ramon Mayor Martins.</p>
      <p className="text-sm mt-2">Federal Institute of Santa Catarina</p>
      <p className="text-xs mt-1 text-gray-500">Powered by NewsAPI, GNews, Currents API and Reuters.</p>
    </div>
  </div>
</footer>
    </div>
  );
};

export default AINewsApp;
