export interface Article {
  id: string;
  url: string;
  title: string;
  source: string;
  author: string;
  publishedDate: string;
  content: string;
  snippet: string;
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

export interface AnalysisResult {
  article: Article;
  bias: BiasMetrics;
  sentiment: SentimentMetrics;
  keywords: KeywordData[];
  themes: ThemeData[];
  summary: string;
  objectivityScore: number;
  readabilityScore: number;
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
  sources: SourceData[];
  articles: Article[];
  topicCoverage: TopicCoverage[];
  overallBiasSpread: {
    left: number;
    centerLeft: number;
    center: number;
    centerRight: number;
    right: number;
  };
  keyNarratives: {
    narrative: string;
    sourcesBiasDistribution: {
      source: string;
      bias: number;
    }[];
  }[];
}

export interface SearchResult {
  id: string;
  topic: string;
  sources: string[];
  biasRange: {
    min: number;
    max: number;
    avg: number;
  };
  sentimentRange: {
    min: number;
    max: number;
    avg: number;
  };
  articleCount: number;
  lastUpdated: string;
}

export interface TrendingTopic {
  id: string;
  topic: string;
  momentum: number; // how quickly it's gaining attention
  biasVariance: number; // how much bias varies across sources
  dominantLeaning: 'left' | 'center-left' | 'center' | 'center-right' | 'right' | 'unknown';
  sourceCount: number;
  lastUpdated: string;
}