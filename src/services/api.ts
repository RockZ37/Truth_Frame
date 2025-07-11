import { IArticle } from '../models/Article';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface AnalysisFilters {
  source?: string;
  startDate?: Date;
  endDate?: Date;
  biasRange?: [number, number];
}

export async function analyzeArticle(url: string): Promise<IArticle> {
  const response = await fetch(`${API_URL}/articles/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error('Failed to analyze article');
  }

  return response.json();
}

export async function compareArticles(urls: string[]): Promise<{
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
  articles: IArticle[];
}> {
  const queryString = urls.map(url => `url=${encodeURIComponent(url)}`).join('&');
  const response = await fetch(`${API_URL}/articles/compare?${queryString}`);

  if (!response.ok) {
    throw new Error('Failed to compare articles');
  }

  return response.json();
}

export async function searchArticles(query: string, filters?: AnalysisFilters): Promise<IArticle[]> {
  const searchParams = new URLSearchParams();
  searchParams.append('q', query);

  if (filters) {
    if (filters.source) searchParams.append('source', filters.source);
    if (filters.startDate) searchParams.append('startDate', filters.startDate.toISOString());
    if (filters.endDate) searchParams.append('endDate', filters.endDate.toISOString());
    if (filters.biasRange) {
      searchParams.append('biasMin', filters.biasRange[0].toString());
      searchParams.append('biasMax', filters.biasRange[1].toString());
    }
  }

  const response = await fetch(`${API_URL}/articles/search?${searchParams}`);

  if (!response.ok) {
    throw new Error('Failed to search articles');
  }

  return response.json();
}

export async function getTrendingTopics(): Promise<Array<{
  name: string;
  count: number;
  sentiment: number;
}>> {
  const response = await fetch(`${API_URL}/articles/trending`);

  if (!response.ok) {
    throw new Error('Failed to fetch trending topics');
  }

  return response.json();
}