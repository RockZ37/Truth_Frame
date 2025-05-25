import React, { createContext, useContext, useState, ReactNode } from 'react';
import { analyzeArticle, compareArticles } from '../services/api';
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

export const AnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);

  const handleArticleAnalysis = async (url: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await analyzeArticle(url);
      setCurrentArticle(result.article);
      setAnalysisResult(result);
    } catch (err) {
      setError('Failed to analyze article. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleArticleComparison = async (urls: string[]) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await compareArticles(urls);
      setComparisonResult(result);
    } catch (err) {
      setError('Failed to compare articles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const searchTopics = async (query: string, filters?: any) => {
    try {
      setIsLoading(true);
      setError(null);
      // Implementation needed
      setSearchResults([]);
    } catch (err) {
      setError('Failed to search topics. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrendingTopics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Implementation needed
      setTrendingTopics([]);
    } catch (err) {
      setError('Failed to fetch trending topics. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearAnalysis = () => {
    setCurrentArticle(null);
    setAnalysisResult(null);
    setComparisonResult(null);
  };

  const clearError = () => {
    setError(null);
  };

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
        searchTopics,
        fetchTrendingTopics,
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