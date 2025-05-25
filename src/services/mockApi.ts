import { AnalysisResult, ComparisonResult, SearchResult, TrendingTopic } from '../types/analysisTypes';

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data for article analysis
export const mockAnalyzeArticle = async (url: string): Promise<AnalysisResult> => {
  await delay(1500); // Simulate API delay
  
  return {
    article: {
      id: '1',
      url,
      title: 'The Impact of Climate Change on Global Economics',
      source: url.includes('cnn') ? 'CNN' : url.includes('fox') ? 'Fox News' : 'The New York Times',
      author: 'John Smith',
      publishedDate: new Date().toISOString(),
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.',
      snippet: 'New research shows that climate change could have significant impacts on global economics...'
    },
    bias: {
      score: url.includes('cnn') ? -0.6 : url.includes('fox') ? 0.7 : 0.1,
      confidence: 0.85,
      leaning: url.includes('cnn') ? 'left' : url.includes('fox') ? 'right' : 'center',
    },
    sentiment: {
      positive: 0.35,
      negative: 0.45,
      neutral: 0.2,
      overall: -0.1,
    },
    keywords: [
      { text: 'climate change', relevance: 0.95, sentiment: -0.2 },
      { text: 'economic impact', relevance: 0.87, sentiment: -0.4 },
      { text: 'global markets', relevance: 0.75, sentiment: 0.1 },
      { text: 'policy response', relevance: 0.68, sentiment: 0.3 },
      { text: 'carbon emissions', relevance: 0.65, sentiment: -0.5 },
    ],
    themes: [
      { 
        name: 'Environmental Impact', 
        keywords: ['climate change', 'carbon emissions', 'global warming'],
        sentiment: -0.4,
        relevance: 0.9
      },
      { 
        name: 'Economic Consequences', 
        keywords: ['economic impact', 'global markets', 'financial risk'],
        sentiment: -0.2,
        relevance: 0.85
      },
      { 
        name: 'Policy Solutions', 
        keywords: ['policy response', 'regulation', 'international cooperation'],
        sentiment: 0.3,
        relevance: 0.7
      },
    ],
    summary: 'This article discusses how climate change is affecting global economics, with a focus on market disruptions and potential policy responses. The tone is somewhat negative regarding the current situation but offers some optimism about potential solutions.',
    objectivityScore: 0.65,
    readabilityScore: 0.78,
  };
};

// Mock data for source comparison
export const mockCompareArticles = async (urls: string[]): Promise<ComparisonResult> => {
  await delay(2000); // Simulate API delay
  
  return {
    topic: 'Climate Change',
    sources: [
      {
        name: 'CNN',
        bias: {
          score: -0.6,
          confidence: 0.85,
          leaning: 'left',
        },
        articleCount: 45,
        topics: ['Global Warming', 'Environmental Policy', 'Renewable Energy'],
      },
      {
        name: 'Fox News',
        bias: {
          score: 0.7,
          confidence: 0.8,
          leaning: 'right',
        },
        articleCount: 32,
        topics: ['Climate Policy', 'Economic Impact', 'Energy Independence'],
      },
      {
        name: 'The New York Times',
        bias: {
          score: -0.3,
          confidence: 0.9,
          leaning: 'center-left',
        },
        articleCount: 67,
        topics: ['Climate Science', 'International Agreements', 'Corporate Response'],
      },
    ],
    articles: [
      {
        id: '1',
        url: 'https://www.cnn.com/article1',
        title: 'Climate Crisis Demands Immediate Action',
        source: 'CNN',
        author: 'Jane Doe',
        publishedDate: new Date().toISOString(),
        content: '',
        snippet: 'Scientists warn that the climate crisis requires unprecedented global cooperation...'
      },
      {
        id: '2',
        url: 'https://www.foxnews.com/article1',
        title: 'The Economic Cost of Climate Policies',
        source: 'Fox News',
        author: 'John Smith',
        publishedDate: new Date().toISOString(),
        content: '',
        snippet: 'New climate policies could cost trillions and impact American energy independence...'
      },
      {
        id: '3',
        url: 'https://www.nytimes.com/article1',
        title: 'Understanding the Climate Challenge',
        source: 'The New York Times',
        author: 'David Williams',
        publishedDate: new Date().toISOString(),
        content: '',
        snippet: 'An in-depth look at the scientific consensus and potential paths forward...'
      },
    ],
    topicCoverage: [
      {
        topic: 'Climate Science',
        sources: [
          { source: 'CNN', bias: -0.6, sentiment: -0.4, coverage: 0.7 },
          { source: 'Fox News', bias: 0.7, sentiment: -0.1, coverage: 0.3 },
          { source: 'The New York Times', bias: -0.3, sentiment: -0.2, coverage: 0.8 },
        ]
      },
      {
        topic: 'Economic Impact',
        sources: [
          { source: 'CNN', bias: -0.5, sentiment: -0.6, coverage: 0.5 },
          { source: 'Fox News', bias: 0.8, sentiment: -0.7, coverage: 0.9 },
          { source: 'The New York Times', bias: -0.2, sentiment: -0.4, coverage: 0.6 },
        ]
      },
      {
        topic: 'Policy Solutions',
        sources: [
          { source: 'CNN', bias: -0.7, sentiment: 0.3, coverage: 0.8 },
          { source: 'Fox News', bias: 0.6, sentiment: -0.5, coverage: 0.4 },
          { source: 'The New York Times', bias: -0.4, sentiment: 0.1, coverage: 0.7 },
        ]
      },
    ],
    overallBiasSpread: {
      left: 0.35,
      centerLeft: 0.25,
      center: 0.1,
      centerRight: 0.05,
      right: 0.25,
    },
    keyNarratives: [
      {
        narrative: 'Climate action is urgent and necessary',
        sourcesBiasDistribution: [
          { source: 'CNN', bias: -0.6 },
          { source: 'The New York Times', bias: -0.3 },
        ]
      },
      {
        narrative: 'Climate policies threaten economic growth',
        sourcesBiasDistribution: [
          { source: 'Fox News', bias: 0.7 },
        ]
      },
      {
        narrative: 'Technology can solve climate challenges',
        sourcesBiasDistribution: [
          { source: 'CNN', bias: -0.4 },
          { source: 'Fox News', bias: 0.5 },
          { source: 'The New York Times', bias: -0.2 },
        ]
      },
    ]
  };
};

// Mock data for topic search
export const mockSearchTopics = async (query: string, filters?: any): Promise<SearchResult[]> => {
  await delay(1000); // Simulate API delay
  
  const results: SearchResult[] = [
    {
      id: '1',
      topic: `${query} in Politics`,
      sources: ['CNN', 'Fox News', 'The New York Times', 'Washington Post'],
      biasRange: {
        min: -0.8,
        max: 0.8,
        avg: 0.1,
      },
      sentimentRange: {
        min: -0.6,
        max: 0.4,
        avg: -0.1,
      },
      articleCount: 145,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: '2',
      topic: `${query} Economic Impact`,
      sources: ['Wall Street Journal', 'CNBC', 'Bloomberg', 'The Economist'],
      biasRange: {
        min: -0.4,
        max: 0.6,
        avg: 0.2,
      },
      sentimentRange: {
        min: -0.5,
        max: 0.3,
        avg: -0.2,
      },
      articleCount: 98,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: '3',
      topic: `${query} Global Perspective`,
      sources: ['BBC', 'Al Jazeera', 'Reuters', 'Associated Press'],
      biasRange: {
        min: -0.5,
        max: 0.3,
        avg: -0.1,
      },
      sentimentRange: {
        min: -0.4,
        max: 0.5,
        avg: 0.1,
      },
      articleCount: 112,
      lastUpdated: new Date().toISOString(),
    },
  ];
  
  return results;
};

// Mock data for trending topics
export const mockTrendingTopics = async (): Promise<TrendingTopic[]> => {
  await delay(800); // Simulate API delay
  
  return [
    {
      id: '1',
      topic: 'Climate Change Legislation',
      momentum: 0.85,
      biasVariance: 0.7,
      dominantLeaning: 'center-left',
      sourceCount: 24,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: '2',
      topic: 'Global Economic Outlook',
      momentum: 0.72,
      biasVariance: 0.5,
      dominantLeaning: 'center',
      sourceCount: 18,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: '3',
      topic: 'Tech Industry Regulation',
      momentum: 0.68,
      biasVariance: 0.6,
      dominantLeaning: 'center-right',
      sourceCount: 15,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: '4',
      topic: 'Healthcare Reform',
      momentum: 0.65,
      biasVariance: 0.8,
      dominantLeaning: 'left',
      sourceCount: 22,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: '5',
      topic: 'Immigration Policy',
      momentum: 0.62,
      biasVariance: 0.9,
      dominantLeaning: 'right',
      sourceCount: 20,
      lastUpdated: new Date().toISOString(),
    },
  ];
};