export interface Article {
  id: string;
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

export interface BiasMetrics {
  score: number; // -1 (very left) to 1 (very right)
  confidence: number; // 0 to 1
  leaning: 'left' | 'center-left' | 'center' | 'center-right' | 'right' | 'unknown';
}

export interface SentimentMetrics {
  positive: number; // 0 to 1
  negative: number; // 0 to 1
  neutral: number; // 0 to 1
  overall: number; // -1 to 1
}

export interface KeywordData {
  text: string;
  relevance: number;
  sentiment: number;
}

export interface ThemeData {
  name: string;
  keywords: string[];
  sentiment: number;
  relevance: number;
}

export interface AnalysisResult extends Article {
  topicCoverage: {
    mainTopics: string[];
    coverage: number;
    depth: number;
  };
  sentimentAnalysis: {
    overall: number;
    breakdown: {
      positive: string[];
      negative: string[];
      neutral: string[];
    };
  };
  biasAnalysis: {
    score: number;
    indicators: string[];
    examples: string[];
  };
}

export interface SourceData {
  name: string;
  bias: BiasMetrics;
  articleCount: number;
  topics: string[];
}

export interface TopicCoverage {
  topic: string;
  sources: {
    source: string;
    bias: number;
    sentiment: number;
    coverage: number; // 0 to 1
  }[];
}

export interface ComparisonResult {
  topic: string;
  sources: Array<{
    name: string;
    bias: {
      score: number;
      confidence: number;
      leaning: string;
    };
    articleCount: number;
    topics: string[];
  }>;
  articles: Article[];
  topicCoverage: {
    sharedTopics: string[];
    uniqueTopics: { [source: string]: string[] };
  };
  overallBiasSpread: {
    min: number;
    max: number;
    average: number;
  };
  keyNarratives: Array<{
    topic: string;
    perspectives: Array<{
      source: string;
      stance: string;
      quotes: string[];
    }>;
  }>;
}

export interface SearchResult {
  topic: string;
  sources: string[];
  biasRange: [number, number];
  sentimentRange: [number, number];
  articleCount: number;
  articles: Article[];
}

export interface TrendingTopic {
  id: string;
  topic: string;
  count: number;
  sentiment: number;
  momentum: number;
  biasVariance: number;
  sources: Array<{
    name: string;
    count: number;
    bias: number;
  }>;
  recentArticles: Article[];
}