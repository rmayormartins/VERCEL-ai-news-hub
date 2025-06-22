// pages/api/news/top.js
export default async function handler(req, res) {
  const { timeframe = 'week' } = req.query;
  
  try {
    const dateFrom = getDateFrom(timeframe);
    const articles = [];
    const promises = [];

    // NewsAPI with popularity sorting
    if (process.env.NEWSAPI_KEY) {
      promises.push(
        fetch(`https://newsapi.org/v2/everything?q=artificial intelligence OR machine learning OR AI&language=en&sortBy=popularity&from=${dateFrom}&pageSize=10&apiKey=${process.env.NEWSAPI_KEY}`)
          .then(res => res.json())
          .then(data => {
            if (data.articles) {
              return data.articles.map(article => ({
                ...article,
                source: article.source?.name || 'NewsAPI',
                category: categorizeArticle(article.title + ' ' + (article.description || '')),
                apiSource: 'NewsAPI',
                views: Math.floor(Math.random() * 3000000) + 500000 // Mock view count
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
        fetch(`https://gnews.io/api/v4/search?q=artificial intelligence OR AI&lang=en&country=us&max=10&from=${dateFrom}&apikey=${process.env.GNEWS_KEY}`)
          .then(res => res.json())
          .then(data => {
            if (data.articles) {
              return data.articles.map(article => ({
                ...article,
                source: article.source?.name || 'GNews',
                category: categorizeArticle(article.title + ' ' + (article.description || '')),
                apiSource: 'GNews',
                views: Math.floor(Math.random() * 2500000) + 300000
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

    // Remove duplicates and sort by views (popularity)
    const uniqueArticles = removeDuplicates(articles);
    const sortedArticles = uniqueArticles.sort((a, b) => (b.views || 0) - (a.views || 0));

    // If no real data, return mock data
    if (sortedArticles.length === 0) {
      const mockArticles = getMockTopNews();
      return res.status(200).json({ 
        articles: mockArticles,
        sources: { 'Mock Data': mockArticles.length },
        total: mockArticles.length,
        fallback: true,
        timeframe
      });
    }

    res.status(200).json({ 
      articles: sortedArticles.slice(0, 20),
      total: sortedArticles.length,
      timeframe
    });
  } catch (error) {
    console.error('Error fetching top news:', error);
    
    // Return mock data on error
    const mockArticles = getMockTopNews();
    res.status(200).json({ 
      articles: mockArticles,
      sources: { 'Mock Data': mockArticles.length },
      total: mockArticles.length,
      fallback: true,
      timeframe
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

function getMockTopNews() {
  return [
    {
      id: 9,
      title: "Meta Invests $50 Billion in AI Infrastructure",
      description: "Largest investment in company history for AI data centers.",
      source: "Reuters",
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      url: "#",
      category: "business",
      views: 2500000,
      apiSource: "Mock Data"
    },
    {
      id: 10,
      title: "Autonomous AI Solves 100-Year-Old Mathematical Problem",
      description: "System developed by university solves conjecture considered impossible.",
      source: "Science",
      publishedAt: new Date(Date.now() - 172800000).toISOString(),
      url: "#",
      category: "research",
      views: 1800000,
      apiSource: "Mock Data"
    },
    {
      id: 11,
      title: "ChatGPT Reaches 1 Billion Active Users",
      description: "Historic milestone for OpenAI's flagship product.",
      source: "TechCrunch",
      publishedAt: new Date(Date.now() - 259200000).toISOString(),
      url: "#",
      category: "business",
      views: 3200000,
      apiSource: "Mock Data"
    }
  ];
}
