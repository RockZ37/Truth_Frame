import { Article, IArticle } from '../models/Article';
import { generateEmbedding, analyzeArticle as analyzeArticleAI } from './aiService';
import { PipelineStage } from 'mongoose';

export async function findArticle(url: string): Promise<IArticle | null> {
  return Article.findOne({ url });
}

export async function createArticle(articleData: {
  url: string;
  title: string;
  source: string;
  author: string;
  content: string;
  publishedDate: Date;
}): Promise<IArticle> {
  const { content } = articleData;
  
  // Generate AI analysis and embedding
  const [analysis, embedding] = await Promise.all([
    analyzeArticleAI(content),
    generateEmbedding(content)
  ]);

  const article = new Article({
    ...articleData,
    snippet: content.substring(0, 200),
    embedding,
    analysis
  });

  return article.save();
}

export async function findSimilarArticles(articleId: string): Promise<IArticle[]> {
  const article = await Article.findById(articleId);
  if (!article) throw new Error('Article not found');

  return Article.find({
    _id: { $ne: article._id },
    embedding: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: article.embedding
        }
      }
    }
  }).limit(5);
}

export async function compareArticles(urls: string[]): Promise<IArticle[]> {
  return Article.find({ url: { $in: urls } });
}

export async function searchArticles(query: string, filters?: {
  source?: string;
  startDate?: Date;
  endDate?: Date;
  biasRange?: [number, number];
}): Promise<IArticle[]> {
  const searchQuery: any = {};

  if (filters?.source) {
    searchQuery.source = filters.source;
  }

  if (filters?.startDate || filters?.endDate) {
    searchQuery.publishedDate = {};
    if (filters.startDate) searchQuery.publishedDate.$gte = filters.startDate;
    if (filters.endDate) searchQuery.publishedDate.$lte = filters.endDate;
  }

  if (filters?.biasRange) {
    searchQuery['analysis.bias.score'] = {
      $gte: filters.biasRange[0],
      $lte: filters.biasRange[1]
    };
  }

  // Full-text search on content and title
  if (query) {
    searchQuery.$text = { $search: query };
  }

  return Article.find(searchQuery)
    .sort({ publishedDate: -1 })
    .limit(20);
}

export async function getTrendingTopics(): Promise<Array<{
  name: string;
  count: number;
  sentiment: number;
}>> {
  const pipeline: PipelineStage[] = [
    { $unwind: '$analysis.themes' },
    {
      $group: {
        _id: '$analysis.themes.name',
        count: { $sum: 1 },
        sentiment: { $avg: '$analysis.themes.sentiment' }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ];

  return Article.aggregate(pipeline);
} 