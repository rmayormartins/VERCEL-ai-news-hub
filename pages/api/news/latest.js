// pages/api/news/latest.js
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const articles = [];
    const promises = [];

    // NewsAPI
    if (process.env.NEWSAPI_KEY) {
      promises.push(
        fetch(`https://newsapi.org/v2/everything?q=artificial intelligence OR machine learning OR AI&language=en&sortBy=publishedAt&pageSize=8&apiKey=${process.env.NEWSAPI_KEY}`)
          .then(res => res.json())
          .then(data => {
            if (data.articles) {
              return data.articles.map(article => ({
                ...article,
                source: article.source?.name || 'NewsAPI',
                category: categorizeArticle(article.title + ' ' + (article.description || '')),
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
        fetch(`https://gnews.io/api/v4/search?q=artificial intelligence OR AI&lang=en&country=us&max=8&apikey=${process.env.GNEWS_KEY}`)
          .then(res => res.json())
          .then(data => {
            if (data.articles) {
              return data.articles.map(article => ({
                ...article,
                source: article.source?.name || 'GNews',
                category: categorizeArticle(article.title + ' ' + (article.description || '')),
                apiSource: 'GNews'
              }));
            }
            return [];
          })
          .catch(() => [])
      );
    }

    // Currents API
    if (process.env.CURRENTS_API_KEY) {
      promises.push(
        fetch(`https://api.currentsapi.services/v1/search?keywords=artificial intelligence,machine learning,AI&language=en&apiKey=${process.env.CURRENTS_API_KEY}`)
          .then(res => res.json())
          .then(data => {
            if (data.news) {
              return data.news.map(article => ({
                title: article.title,
                description: article.description,
                url: article.url,
                publishedAt: article.published,
                source: 'Currents',
                category: categorizeArticle(article.title + ' ' + (article.description || '')),
                apiSource: 'Currents'
              }));
            }
            return [];
          })
          .catch(() => [])
      );
    }

    // Mediastack
    if (process.env.MEDIASTACK_KEY) {
      promises.push(
        fetch(`https://api.mediastack.com/v1/news?access_key=${process.env.MEDIASTACK_KEY}&keywords=artificial intelligence,machine learning,AI&languages=en&limit=8`)
          .then(res => res.json())
          .then(data => {
            if (data.data) {
              return data.data.map(article => ({
                title: article.title,
                description: article.description,
                url: article.url,
                publishedAt: article.published_at,
                source: article.source || 'Mediastack',
                category: categorizeArticle(article.title + ' ' + (article.description || '')),
                apiSource: 'Mediastack'
              }));
            }
            return [];
          })
          .catch(() => [])
      );
    }

    // Wait for all API calls to complete
    const results = await Promise.allSettled(promises);
    
    // Combine all articles
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && Array.isArray(result.value)) {
        articles.push(...result.value);
      }
    });

    // Remove duplicates and sort by date
    const uniqueArticles = removeDuplicates(articles);
    const sortedArticles = uniqueArticles.sort((a, b) => 
      new Date(b.publishedAt) - new Date(a.publishedAt)
    );

    // Get API source statistics
    const apiStats = {};
    sortedArticles.forEach(article => {
      const api = article.apiSource || 'Unknown';
      if (!apiStats[api]) {
        apiStats[api] = 0;
      }
      apiStats[api]++;
    });

    res.status(200).json({ 
      articles: sortedArticles.slice(0, 30),
      sources: apiStats,
      total: sortedArticles.length
    });
  } catch (error) {
    console.error('Error fetching latest news:', error);
    
    // Return mock data if all APIs fail
    const mockArticles = getMockLatestNews();
    res.status(200).json({ 
      articles: mockArticles,
      sources: { 'Mock Data': mockArticles.length },
      total: mockArticles.length,
      fallback: true
    });
  }
}

// Utility functions
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

function getMockLatestNews() {
  return [
    {
      id: 1,
      title: "OpenAI Launches New GPT Version with Enhanced Capabilities",
      description: "The latest update promises better contextual understanding and reduced hallucinations.",
      source: "TechCrunch",
      publishedAt: new Date().toISOString(),
      url: "#",
      category: "machine-learning",
      apiSource: "Mock Data"
    },
    {
      id: 2,
      title: "Google DeepMind Develops AI that Predicts Climate Change",
      description: "New model can predict climate patterns with 95% accuracy.",
      source: "Nature",
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      url: "#",
      category: "research",
      apiSource: "Mock Data"
    },
    {
      id: 3,
      title: "Brazilian Startup Creates AI for Medical Diagnosis",
      description: "Technology promises to revolutionize cancer diagnosis in Brazil.",
      source: "Reuters",
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      url: "#",
      category: "healthcare",
      apiSource: "Mock Data"
    }
  ];
}
