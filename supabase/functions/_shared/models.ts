import { ObjectId, Collection } from "mongodb";

export interface Article {
  _id: ObjectId;
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

export type ArticleModel = Collection<Article>;