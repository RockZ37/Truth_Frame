import React, { useEffect } from 'react';
import { useAnalysis } from '../context/AnalysisContext';
import TopicOverview from '../components/analysis/TopicOverview';
import { Loader } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { 
    isLoading, 
    error, 
    trendingTopics, 
    fetchTrendingTopics, 
    clearError 
  } = useAnalysis();
  
  useEffect(() => {
    fetchTrendingTopics();
    // Set page title
    document.title = 'Truth_Frame | Media Bias Analyzer';
  }, [fetchTrendingTopics]);
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Media Bias Analyzer</h1>
        <p className="text-neutral-600">
          Uncover media bias and compare how different news sources cover the same topics.
          Our AI-powered analysis helps you gain a more balanced understanding of current events.
        </p>
      </div>
      
      {error && (
        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md mb-6 flex justify-between items-center">
          <span>{error}</span>
          <button 
            onClick={clearError}
            className="text-error-700 hover:text-error-800"
          >
            &times;
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-primary-50 rounded-lg">
                <div className="text-primary-700 font-bold text-lg mb-2">1. Analysis</div>
                <p className="text-sm text-neutral-600">
                  Our AI engine analyzes articles for bias, sentiment, and key themes using advanced NLP techniques.
                </p>
              </div>
              <div className="p-4 bg-secondary-50 rounded-lg">
                <div className="text-secondary-700 font-bold text-lg mb-2">2. Comparison</div>
                <p className="text-sm text-neutral-600">
                  Compare coverage across multiple sources to see how different outlets frame the same story.
                </p>
              </div>
              <div className="p-4 bg-accent-50 rounded-lg">
                <div className="text-accent-700 font-bold text-lg mb-2">3. Insights</div>
                <p className="text-sm text-neutral-600">
                  Get clear visualizations and insights to understand media narratives and identify potential bias.
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <Link to="/analyze" className="btn btn-primary">
                Analyze an Article
              </Link>
              <Link to="/compare" className="btn btn-outline">
                Compare Sources
              </Link>
            </div>
          </div>
        </div>
        
        <div>
          <div className="card h-full">
            <h2 className="text-xl font-semibold mb-4">Quick Tools</h2>
            <div className="space-y-3">
              <Link to="/analyze" className="flex items-center p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                  <span className="text-primary-700 font-bold">A</span>
                </div>
                <div>
                  <div className="font-medium">Article Analysis</div>
                  <div className="text-xs text-neutral-500">Analyze a single article for bias</div>
                </div>
              </Link>
              
              <Link to="/compare" className="flex items-center p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
                <div className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center mr-3">
                  <span className="text-secondary-700 font-bold">C</span>
                </div>
                <div>
                  <div className="font-medium">Source Comparison</div>
                  <div className="text-xs text-neutral-500">Compare multiple sources on a topic</div>
                </div>
              </Link>
              
              <Link to="/search" className="flex items-center p-3 bg-accent-50 rounded-lg hover:bg-accent-100 transition-colors">
                <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center mr-3">
                  <span className="text-accent-700 font-bold">S</span>
                </div>
                <div>
                  <div className="font-medium">Topic Search</div>
                  <div className="text-xs text-neutral-500">Search for analysis on specific topics</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Trending Topics</h2>
          {isLoading && (
            <div className="flex items-center text-neutral-500">
              <Loader className="w-4 h-4 animate-spin mr-2" />
              Loading...
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-6 bg-neutral-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-neutral-200 rounded w-1/4 mb-6"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-neutral-200 rounded w-full"></div>
                  <div className="h-4 bg-neutral-200 rounded w-full"></div>
                  <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trendingTopics.map(topic => (
              <TopicOverview key={topic.id} topic={topic} />
            ))}
          </div>
        )}
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Media Landscape</h2>
        <div className="card">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 md:pr-6">
              <h3 className="text-lg font-medium mb-3">Understanding Bias</h3>
              <p className="text-neutral-600 text-sm mb-4">
                Media bias refers to the perceived bias of journalists and news producers in selecting and covering stories.
                It can manifest in various ways, including:
              </p>
              <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1 mb-4">
                <li>Selection of stories to cover or ignore</li>
                <li>Word choice and tone of coverage</li>
                <li>Placement and prominence of stories</li>
                <li>Sources cited and perspectives presented</li>
                <li>Context provided or omitted</li>
              </ul>
              <p className="text-neutral-600 text-sm">
                Our AI analyzes these factors to provide an objective assessment of potential bias in news coverage.
              </p>
            </div>
            
            <div className="md:w-1/2 md:pl-6 md:border-l border-neutral-200 mt-6 md:mt-0">
              <h3 className="text-lg font-medium mb-3">How to Use This Tool</h3>
              <div className="space-y-3">
                <div className="flex">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                    <span className="text-primary-700 font-medium text-sm">1</span>
                  </div>
                  <p className="text-sm text-neutral-600">
                    <strong>Analyze individual articles</strong> to understand potential bias and sentiment.
                  </p>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                    <span className="text-primary-700 font-medium text-sm">2</span>
                  </div>
                  <p className="text-sm text-neutral-600">
                    <strong>Compare multiple sources</strong> covering the same topic to see different perspectives.
                  </p>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                    <span className="text-primary-700 font-medium text-sm">3</span>
                  </div>
                  <p className="text-sm text-neutral-600">
                    <strong>Search for topics</strong> to find existing analyses and comparisons.
                  </p>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                    <span className="text-primary-700 font-medium text-sm">4</span>
                  </div>
                  <p className="text-sm text-neutral-600">
                    <strong>Explore trending topics</strong> to see what's being covered and how.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;