import mongoose, { Schema, Document } from 'mongoose';

export interface IArticle extends Document {
  url: string;
  title: string;
  source: string;
  author: string;
  publishedDate: Date;
  content: string;
  snippet: string;
  embedding: number[];
  analysis: {
    bias: {
      score: number;
      confidence: number;
      leaning: string;
    };
    sentiment: {
      positive: number;
      negative: number;
      neutral: number;
      overall: number;
    };
    keywords: Array<{
      text: string;
      relevance: number;
      sentiment: number;
    }>;
    themes: Array<{
      name: string;
      keywords: string[];
      sentiment: number;
      relevance: number;
    }>;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>({
  url: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  source: { type: String, required: true },
  author: { type: String, required: true },
  publishedDate: { type: Date, required: true },
  content: { type: String, required: true },
  snippet: { type: String, required: true },
  embedding: [{ type: Number }],
  analysis: {
    bias: {
      score: { type: Number, required: true },
      confidence: { type: Number, required: true },
      leaning: { type: String, required: true },
    },
    sentiment: {
      positive: { type: Number, required: true },
      negative: { type: Number, required: true },
      neutral: { type: Number, required: true },
      overall: { type: Number, required: true },
    },
    keywords: [{
      text: { type: String, required: true },
      relevance: { type: Number, required: true },
      sentiment: { type: Number, required: true },
    }],
    themes: [{
      name: { type: String, required: true },
      keywords: [{ type: String }],
      sentiment: { type: Number, required: true },
      relevance: { type: Number, required: true },
    }],
  },
}, {
  timestamps: true,
  index: [
    { url: 1 },
    { source: 1 },
    { publishedDate: -1 },
    { 'analysis.bias.score': 1 },
    { 'analysis.sentiment.overall': 1 },
  ],
});

// Create vector search index
ArticleSchema.index(
  { embedding: '2dsphere' },
  {
    name: 'vector_index',
    weights: { embedding: 1 },
  }
);

export const Article = mongoose.model<IArticle>('Article', ArticleSchema);