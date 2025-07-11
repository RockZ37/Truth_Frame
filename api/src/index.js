const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Article } = require('./models/Article');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch(err => {
    console.error('Initial MongoDB connection failed. Please check your MONGODB_URI and IP whitelist settings.', err);
  });

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error after initial connection:', err);
});

// Routes
const { scrapeArticle } = require('./services/scraper');
const { analyzeArticleContent, formatAnalysisResults } = require('./services/nlpService');

// Helper function to calculate bias score from sentiment and entities
function calculateBiasScore(analysis) {
  if (!analysis) return { score: 0.5, confidence: 0.5, leaning: 'Center' };
  
  // Simple bias calculation based on sentiment and entities
  // This can be enhanced based on your specific requirements
  const sentimentScore = analysis.sentiment?.score || 0;
  const biasScore = (sentimentScore + 1) / 2; // Convert from [-1, 1] to [0, 1]
  
  return {
    score: biasScore,
    confidence: 0.8, // Placeholder confidence value
    leaning: biasScore > 0.6 ? 'Right' : biasScore < 0.4 ? 'Left' : 'Center'
  };
}

app.post('/api/articles/analyze', async (req, res) => {
  console.log(`[${new Date().toISOString()}] POST /api/articles/analyze`);
  const { url } = req.body;
  if (!url) {
    console.error('  -> Error: URL is missing from request body.');
    return res.status(400).json({ error: 'URL is required' });
  }
  console.log(`  -> URL received: ${url}`);

  try {
    console.log('  -> Searching for article in database...');
    let article = await Article.findOne({ url });

    if (article) {
      console.log('  -> Article found in DB. Returning existing document.');
      return res.json(article);
    }

    console.log('  -> Article not found. Scraping article from URL...');
    let scrapedData;
    try {
      scrapedData = await scrapeArticle(url);
    } catch (scrapeError) {
      console.error(`  -> SCRAPE FAILED for ${url}:`, scrapeError.message);
      return res.status(422).json({ error: 'Failed to retrieve article from the source. The site may be blocking requests or the content is unreadable.' });
    }

    // Perform NLP analysis
    console.log('  -> Analyzing article content with NLP...');
    let analysis = {
      bias: { score: 0.5, confidence: 0.5, leaning: 'Center' },
      sentiment: { positive: 0, negative: 0, neutral: 1, overall: 0 },
      keywords: [],
      themes: [],
    };

    try {
      const nlpResult = await analyzeArticleContent(scrapedData.content);
      
      if (nlpResult.success) {
        const formattedResults = formatAnalysisResults(nlpResult);
        analysis.bias = calculateBiasScore(formattedResults);
        analysis.sentiment = {
          positive: Math.max(0, formattedResults.sentiment?.score || 0),
          negative: Math.abs(Math.min(0, formattedResults.sentiment?.score || 0)),
          neutral: 1 - Math.abs(formattedResults.sentiment?.score || 0),
          overall: formattedResults.sentiment?.score || 0
        };
        analysis.keywords = formattedResults.keywords || [];
        analysis.themes = formattedResults.themes || [];
      } else {
        console.warn('  -> NLP analysis failed, using fallback analysis');
      }
    } catch (nlpError) {
      console.error('  -> Error during NLP analysis:', nlpError);
      // Continue with fallback analysis
    }

    article = new Article({
      ...scrapedData,
      analysis: analysis,
      analyzedAt: new Date(),
      // embedding will be calculated later
    });

    console.log('  -> Saving new article to the database...');
    await article.save();
    console.log('  -> Article saved successfully.');

    res.status(201).json(article);

  } catch (dbError) {
    console.error(`  -> DATABASE or UNEXPECTED ERROR in /api/articles/analyze:`, dbError);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

app.get('/api/articles/compare', async (req, res) => {
  try {
    const urls = req.query.url;
    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({ error: 'URLs are required' });
    }
    const articles = await Article.find({ url: { $in: urls } });
    res.json({
      topic: 'Sample Topic', // This should be determined based on articles
      sources: articles.map(article => ({
        name: article.source,
        bias: article.analysis.bias,
        articleCount: 1,
        topics: article.analysis.themes.map(theme => theme.name),
      })),
      articles,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/articles/search', async (req, res) => {
  try {
    const { q, source, startDate, endDate, biasMin, biasMax } = req.query;
    const query = {};

    if (q) query.$text = { $search: q };
    if (source) query.source = source;
    if (startDate || endDate) {
      query.publishedDate = {};
      if (startDate) query.publishedDate.$gte = new Date(startDate);
      if (endDate) query.publishedDate.$lte = new Date(endDate);
    }
    if (biasMin || biasMax) {
      query['analysis.bias.score'] = {};
      if (biasMin) query['analysis.bias.score'].$gte = Number(biasMin);
      if (biasMax) query['analysis.bias.score'].$lte = Number(biasMax);
    }

    const articles = await Article.find(query)
      .sort({ publishedDate: -1 })
      .limit(20);

    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/articles/trending', async (req, res) => {
  try {
    const pipeline = [
      { $unwind: '$analysis.themes' },
      {
        $group: {
          _id: '$analysis.themes.name',
          count: { $sum: 1 },
          sentiment: { $avg: '$analysis.themes.sentiment' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          name: '$_id',
          count: 1,
          sentiment: 1,
          _id: 0
        }
      }
    ];

    const topics = await Article.aggregate(pipeline);
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
}); 