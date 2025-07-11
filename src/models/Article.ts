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

const ArticleSchema = new Schema<IArticle>(
  {
    url: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    source: { type: String, required: true },
    author: { type: String, required: true },
    publishedDate: { type: Date, required: true },
    content: { type: String, required: true },
    snippet: { type: String, required: true },
    embedding: [Number],
    analysis: {
      bias: {
        score: Number,
        confidence: Number,
        leaning: String,
      },
      sentiment: {
        positive: Number,
        negative: Number,
        neutral: Number,
        overall: Number,
      },
      keywords: [{
        text: String,
        relevance: Number,
        sentiment: Number,
      }],
      themes: [{
        name: String,
        keywords: [String],
        sentiment: Number,
        relevance: Number,
      }],
    },
  },
  { timestamps: true }
);

// Create vector search index
ArticleSchema.index(
  { embedding: '2dsphere' },
  {
    name: 'vector_index',
    weights: { embedding: 1 },
  }
);

export const Article = mongoose.model<IArticle>('Article', ArticleSchema);