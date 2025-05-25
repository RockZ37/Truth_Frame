import { serve } from "http/server.ts";
import { connectDB } from '../_shared/db.ts';
import { Article, ArticleModel } from '../_shared/models.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:5173',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Credentials': 'true',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }

  try {
    const url = new URL(req.url);
    const urls = url.searchParams.get('urls')?.split(',') || [];
    
    if (urls.length < 2) {
      throw new Error('At least two URLs are required for comparison');
    }
    
    // Connect to MongoDB
    const client = await connectDB();
    const db = client.db('news_analyzer');
    const articles: ArticleModel = db.collection('articles');
    
    // Fetch articles
    const foundArticles = await articles.find({ url: { $in: urls } }).toArray();
    
    // Generate comparison analysis
    const comparison = {
      topic: 'Sample Topic',
      sources: foundArticles.map(article => ({
        name: article.source,
        bias: article.analysis.bias,
        articleCount: 1,
        topics: article.analysis.themes.map(theme => theme.name),
      })),
      articles: foundArticles,
    };
    
    return new Response(JSON.stringify(comparison), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});