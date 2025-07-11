import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { analyzeArticle as analyzeArticleApi, compareArticles as compareArticlesApi, searchArticles, getTrendingTopics as fetchTrendingTopicsApi } from '../services/api';
import { Article, AnalysisResult, ComparisonResult, SearchResult, TrendingTopic } from '../types/analysisTypes';

interface AnalysisContextType {
  isLoading: boolean;
  error: string | null;
  currentArticle: Article | null;
  analysisResult: AnalysisResult | null;
  comparisonResult: ComparisonResult | null;
  searchResults: SearchResult[];
  trendingTopics: TrendingTopic[];
  analyzeArticle: (url: string) => Promise<void>;
  compareArticles: (urls: string[]) => Promise<void>;
  searchTopics: (query: string, filters?: any) => Promise<void>;
  fetchTrendingTopics: () => Promise<void>;
  clearAnalysis: () => void;
  clearError: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

const transformToArticle = (mongoArticle: any): Article => ({
  id: mongoArticle._id.toString(),
  url: mongoArticle.url,
  title: mongoArticle.title,
  source: mongoArticle.source,
  author: mongoArticle.author,
  publishedDate: new Date(mongoArticle.publishedDate),
  content: mongoArticle.content,
  snippet: mongoArticle.snippet,
  embedding: mongoArticle.embedding,
  analysis: mongoArticle.analysis,
  createdAt: new Date(mongoArticle.createdAt),
  updatedAt: new Date(mongoArticle.updatedAt),
});

const transformToAnalysisResult = (mongoArticle: any): AnalysisResult => ({
  ...transformToArticle(mongoArticle),
  topicCoverage: {
    mainTopics: mongoArticle.analysis.themes.map((t: any) => t.name),
    coverage: 0.8, // This should be calculated based on the content
    depth: 0.7, // This should be calculated based on the content
  },
  sentimentAnalysis: {
    overall: mongoArticle.analysis.sentiment.overall,
    breakdown: {
      positive: mongoArticle.analysis.keywords
        .filter((k: any) => k.sentiment > 0)
        .map((k: any) => k.text),
      negative: mongoArticle.analysis.keywords
        .filter((k: any) => k.sentiment < 0)
        .map((k: any) => k.text),
      neutral: mongoArticle.analysis.keywords
        .filter((k: any) => k.sentiment === 0)
        .map((k: any) => k.text),
    },
  },
  biasAnalysis: {
    score: mongoArticle.analysis.bias.score,
    indicators: [], // This should be extracted from the content
    examples: [], // This should be extracted from the content
  },
});

const transformToSearchResult = (articles: any[]): SearchResult[] => {
  const groupedArticles = articles.reduce((acc: { [key: string]: any[] }, article: any) => {
    const mainTheme = article.analysis.themes[0]?.name || 'Uncategorized';
    acc[mainTheme] = acc[mainTheme] || [];
    acc[mainTheme].push(article);
    return acc;
  }, {});

  return Object.entries(groupedArticles).map(([topic, articles]) => ({
    topic,
    sources: [...new Set(articles.map((a: any) => a.source))],
    biasRange: [
      Math.min(...articles.map((a: any) => a.analysis.bias.score)),
      Math.max(...articles.map((a: any) => a.analysis.bias.score)),
    ],
    sentimentRange: [
      Math.min(...articles.map((a: any) => a.analysis.sentiment.overall)),
      Math.max(...articles.map((a: any) => a.analysis.sentiment.overall)),
    ],
    articleCount: articles.length,
    articles: articles.map(transformToArticle),
  }));
};

const transformToTrendingTopic = (topic: any): TrendingTopic => ({
  id: topic._id.toString(),
  topic: topic.name,
  count: topic.count,
  sentiment: topic.sentiment,
  momentum: 0, // This should be calculated based on time series data
  biasVariance: 0, // This should be calculated from the articles
  sources: [], // This should be populated from the articles
  recentArticles: [], // This should be populated with recent articles
});

export const AnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);

  const handleArticleAnalysis = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentArticle(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeArticleApi(url);
      const transformedArticle = transformToArticle(result);
      const transformedAnalysis = transformToAnalysisResult(result);
      setCurrentArticle(transformedArticle);
      setAnalysisResult(transformedAnalysis);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleArticleComparison = useCallback(async (urls: string[]) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await compareArticlesApi(urls);
      setComparisonResult({
        ...result,
        articles: result.articles.map(transformToArticle),
        topicCoverage: {
          sharedTopics: [], // Calculate shared topics
          uniqueTopics: {}, // Calculate unique topics per source
        },
        overallBiasSpread: {
          min: Math.min(...result.articles.map(a => a.analysis.bias.score)),
          max: Math.max(...result.articles.map(a => a.analysis.bias.score)),
          average: result.articles.reduce((sum, a) => sum + a.analysis.bias.score, 0) / result.articles.length,
        },
        keyNarratives: [], // Extract key narratives from articles
      });
    } catch (err) {
      setError('Failed to compare articles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearchTopics = useCallback(async (query: string, filters?: any) => {
    try {
      setIsLoading(true);
      setError(null);
      const results = await searchArticles(query, filters);
      setSearchResults(transformToSearchResult(results));
    } catch (err) {
      setError('Failed to search topics. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFetchTrendingTopics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const topics = await fetchTrendingTopicsApi();
      setTrendingTopics(topics.map(transformToTrendingTopic));
    } catch (err) {
      setError('Failed to fetch trending topics. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearAnalysis = useCallback(() => {
    setCurrentArticle(null);
    setAnalysisResult(null);
    setComparisonResult(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AnalysisContext.Provider
      value={{
        isLoading,
        error,
        currentArticle,
        analysisResult,
        comparisonResult,
        searchResults,
        trendingTopics,
        analyzeArticle: handleArticleAnalysis,
        compareArticles: handleArticleComparison,
        searchTopics: handleSearchTopics,
        fetchTrendingTopics: handleFetchTrendingTopics,
        clearAnalysis,
        clearError,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};