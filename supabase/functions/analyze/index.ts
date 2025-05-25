/// <reference path="../types.d.ts" />
import { serve } from "http/server.ts";
import { connectDB } from '../_shared/db.ts';
import { analyzeArticle, generateEmbedding } from '../_shared/vertexai.ts';
import { Article, ArticleModel } from '../_shared/models.ts';
import { ObjectId } from "mongodb";


const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:5173',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
    const { url } = await req.json();
    
    // Connect to MongoDB
    const client = await connectDB();
    const db = client.db('news_analyzer');
    const articles: ArticleModel = db.collection('articles');
    
    // Check if article already exists
    let article = await articles.findOne({ url });
    
    if (!article) {
      // TODO: Replace with real article fetching logic
      const content = 'Sample content';
      
      // Generate analysis and embedding
      const analysis = await analyzeArticle(content);
      const embedding = await generateEmbedding(content);
      
      // Create new article
      const result = await articles.insertOne({
        url,
        title: 'Sample Title',
        source: 'Sample Source',
        author: 'Sample Author',
        publishedDate: new Date(),
        content,
        snippet: content.substring(0, 200),
        embedding,
        analysis,
        createdAt: new Date(),
        updatedAt: new Date(),
        _id: new ObjectId
      });
      
      article = await articles.findOne({ _id: result.insertedId });
    }

    return new Response(JSON.stringify(article), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
});
