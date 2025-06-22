// pages/api/news/filtered.js
export default async function handler(req, res) {
  const { theme, timeframe = 'week' } = req.query;
  
  try {
    const dateFrom = getDateFrom(timeframe);
    let query = 'artificial intelligence OR machine learning OR AI';
    
    // Add theme-specific filters
    if (theme && theme !== 'all') {
      const themeQueries = {
        'healthcare': ' AND (healthcare OR medical OR diagnosis OR hospital OR patient)',
        'business': ' AND (business OR investment OR startup OR company OR revenue)',
        'research': ' AND (research OR study OR university OR paper OR scientist)',
        'defense': ' AND (defense OR military OR security OR warfare OR cybersecurity OR surveillance)',
        'telecommunications': ' AND (telecommunications OR telecom OR 5G OR network OR connectivity OR mobile)',
        'regulation': ' AND (regulation OR law OR government OR policy OR legal OR compliance)',
        'robotics': ' AND (robotics OR robot OR autonomous OR automation)',
        'education': ' AND (education OR learning OR student OR teaching OR academic)',
        'hardware': ' AND (hardware OR chip OR processor OR GPU OR computing)',
        'ethics': ' AND (ethics OR bias OR fairness OR responsibility OR transparency)',
        'machine-learning': ' AND (machine learning OR neural network OR deep learning OR algorithm)'
      };
      
      if (themeQueries[theme]) {
        query += themeQueries[theme];
      }
    }

    const articles = [];
    const promises = [];

    // NewsAPI
    if (process.env.NEWSAPI_KEY) {
      promises.push(
        fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&from=${dateFrom}&pageSize=15&apiKey=${process.env.NEWSAPI_KEY}`)
          .then(res => res.json())
          .then(data => {
            if (data.articles) {
              return data.articles.map(article => ({
                ...article,
                source: article.source?.name || 'NewsAPI',
                category: theme || categorizeArticle(article.title + ' ' + (article.description || '')),
                apiSource: 'NewsAPI'
              }));
            }
            return [];
          })
          .catch(() => [])
      );
    }

    // GNews
    if (process.env.GNEWS_KEY) {
      promises.push(
        fetch(`https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=15&apikey=${process.env.GNEWS_KEY}`)
          .then(res => res.json())
          .then(data => {
            if (data.articles) {
              return data.articles.map(article => ({
                ...article,
                source: article.source?.name || 'GNews',
                category: theme || categorizeArticle(article.title + ' ' + (article.description || '')),
                apiSource: 'GNews'
              }));
            }
            return [];
          })
          .catch(() => [])
      );
    }

    // Wait for all API calls
    const results = await Promise.allSettled(promises);
    
    // Combine all articles
    results.forEach((result) => {
      if (result.status === 'fulfilled' && Array.isArray(result.value)) {
        articles.push(...result.value);
      }
    });

    // Remove duplicates and sort by date
    const uniqueArticles = removeDuplicates(articles);
    const sortedArticles = uniqueArticles.sort((a, b) => 
      new Date(b.publishedAt) - new Date(a.publishedAt)
    );

    // If no real data or specific theme requested, return mock data
    if (sortedArticles.length === 0 || theme !== 'all') {
      const mockArticles = getMockFilteredNews(theme);
      return res.status(200).json({ 
        articles: mockArticles,
        theme: theme,
        timeframe: timeframe,
        total: mockArticles.length,
        fallback: true
      });
    }

    res.status(200).json({ 
      articles: sortedArticles.slice(0, 20),
      theme: theme,
      timeframe: timeframe,
      total: sortedArticles.length
    });
  } catch (error) {
    console.error('Error fetching filtered news:', error);
    
    // Return mock data on error
    const mockArticles = getMockFilteredNews(theme);
    res.status(200).json({ 
      articles: mockArticles,
      theme: theme,
      timeframe: timeframe,
      total: mockArticles.length,
      fallback: true
    });
  }
}

function getDateFrom(timeframe) {
  const now = new Date();
  switch (timeframe) {
    case 'day':
      return new Date(now.setDate(now.getDate() - 1)).toISOString().split('T')[0];
    case 'week':
      return new Date(now.setDate(now.getDate() - 7)).toISOString().split('T')[0];
    case 'month':
      return new Date(now.setMonth(now.getMonth() - 1)).toISOString().split('T')[0];
    case '5months':
      return new Date(now.setMonth(now.getMonth() - 5)).toISOString().split('T')[0];
    default:
      return new Date(now.setDate(now.getDate() - 7)).toISOString().split('T')[0];
  }
}

function categorizeArticle(text) {
  const categories = {
    'healthcare': ['health', 'medical', 'diagnosis', 'patient', 'hospital', 'doctor', 'clinical'],
    'business': ['business', 'company', 'startup', 'investment', 'revenue', 'market', 'finance'],
    'research': ['research', 'study', 'university', 'paper', 'scientist', 'academic', 'experiment'],
    'regulation': ['regulation', 'law', 'government', 'policy', 'legal', 'compliance', 'rules'],
    'machine-learning': ['machine learning', 'neural network', 'deep learning', 'algorithm', 'model'],
    'defense': ['defense', 'military', 'security', 'warfare', 'cybersecurity', 'surveillance', 'army'],
    'telecommunications': ['telecommunications', 'telecom', '5G', 'network', 'connectivity', 'mobile', 'wireless'],
    'robotics': ['robotics', 'robot', 'autonomous', 'automation', 'drone', 'mechanical'],
    'education': ['education', 'learning', 'student', 'teaching', 'academic', 'school', 'university'],
    'hardware': ['hardware', 'chip', 'processor', 'GPU', 'computing', 'semiconductor', 'nvidia'],
    'ethics': ['ethics', 'bias', 'fairness', 'responsibility', 'transparency', 'moral', 'ethical']
  };

  const lowerText = text.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return category;
    }
  }
  
  return 'general';
}

function removeDuplicates(articles) {
  const seen = new Set();
  return articles.filter(article => {
    const key = article.title?.toLowerCase() || '';
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getMockFilteredNews(theme) {
  const allMockNews = [
    {
      id: 101,
      title: "AI-Powered Robot Performs Complex Surgery Successfully",
      description: "First fully autonomous surgical procedure completed.",
      source: "Science Daily",
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      url: "#",
      category: "healthcare",
      apiSource: "Mock Data"
    },
    {
      id: 102,
      title: "Pentagon Deploys AI-Powered Defense Systems",
      description: "Military unveils autonomous defense network capable of real-time threat detection.",
      source: "Defense News",
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      url: "#",
      category: "defense",
      apiSource: "Mock Data"
    },
    {
      id: 103,
      title: "5G Networks Enhanced with AI for Smart Cities",
      description: "Telecommunications giants partner to deploy AI-optimized network infrastructure.",
      source: "Telecom World",
      publishedAt: new Date(Date.now() - 10800000).toISOString(),
      url: "#",
      category: "telecommunications",
      apiSource: "Mock Data"
    },
    {
      id: 104,
      title: "AI Tutoring System Improves Student Scores by 40%",
      description: "Personalized learning platform shows remarkable results.",
      source: "Education Week",
      publishedAt: new Date(Date.now() - 14400000).toISOString(),
      url: "#",
      category: "education",
      apiSource: "Mock Data"
    },
    {
      id: 105,
      title: "Nvidia Unveils Next-Generation AI Chips",
      description: "New architecture promises 10x performance improvement.",
      source: "AnandTech",
      publishedAt: new Date(Date.now() - 18000000).toISOString(),
      url: "#",
      category: "hardware",
      apiSource: "Mock Data"
    }
  ];

  if (theme && theme !== 'all') {
    return allMockNews.filter(article => article.category === theme);
  }
  
  return allMockNews;
}
