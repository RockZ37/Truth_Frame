import React, { useState, useEffect } from 'react';
import { useAnalysis } from '../context/AnalysisContext';
import BiasScale from '../components/analysis/BiasScale';
import SentimentChart from '../components/analysis/SentimentChart';
import KeywordCloud from '../components/analysis/KeywordCloud';
import { Loader, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

const ArticleAnalysis: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { 
    isLoading, 
    error, 
    currentArticle, 
    analysisResult, 
    analyzeArticle, 
    clearAnalysis,
    clearError 
  } = useAnalysis();

  useEffect(() => {
    // Set page title
    document.title = 'Article Analysis | NewsLens';
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      analyzeArticle(url);
    }
  };
  
  const handleExampleClick = (exampleUrl: string) => {
    setUrl(exampleUrl);
    analyzeArticle(exampleUrl);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Article Analysis</h1>
        <p className="text-neutral-600">
          Enter a news article URL to analyze it for bias, sentiment, and key themes.
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
      
      <div className="card mb-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="url" className="label">
              Article URL
            </label>
            <div className="flex">
              <input
                type="url"
                id="url"
                className="input rounded-r-none flex-grow"
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
              <button
                type="submit"
                className="btn btn-primary rounded-l-none"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze'
                )}
              </button>
            </div>
          </div>
        </form>
        
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Example Articles</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleExampleClick('https://www.cnn.com/example')}
              className="text-xs px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full hover:bg-primary-100"
            >
              CNN Example
            </button>
            <button
              onClick={() => handleExampleClick('https://www.foxnews.com/example')}
              className="text-xs px-3 py-1.5 bg-accent-50 text-accent-700 rounded-full hover:bg-accent-100"
            >
              Fox News Example
            </button>
            <button
              onClick={() => handleExampleClick('https://www.nytimes.com/example')}
              className="text-xs px-3 py-1.5 bg-secondary-50 text-secondary-700 rounded-full hover:bg-secondary-100"
            >
              NY Times Example
            </button>
          </div>
        </div>
      </div>
      
      {isLoading && !analysisResult && (
        <div className="card flex flex-col items-center justify-center py-16">
          <Loader className="w-12 h-12 text-primary-500 animate-spin mb-4" />
          <h2 className="text-xl font-medium mb-2">Analyzing Article</h2>
          <p className="text-neutral-500 text-center max-w-md">
            Our AI is analyzing the article for bias, sentiment, and key themes. This may take a few moments...
          </p>
        </div>
      )}
      
      {analysisResult && currentArticle && (
        <div>
          <div className="card mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold mb-1">{currentArticle.title}</h2>
                <div className="flex items-center text-sm text-neutral-500 mb-2">
                  <span className="mr-3">{currentArticle.source}</span>
                  <span className="mr-3">By {currentArticle.author}</span>
                  <span>{formatDate(currentArticle.publishedDate)}</span>
                </div>
              </div>
              <button 
                onClick={clearAnalysis}
                className="text-neutral-500 hover:text-neutral-700"
              >
                &times;
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-neutral-700">{currentArticle.snippet}</p>
              <a 
                href={currentArticle.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline text-sm mt-2 inline-block"
              >
                View Original Article
              </a>
            </div>
            
            <div className="border-t border-neutral-200 pt-4 mt-4">
              <h3 className="font-medium mb-3">Analysis Summary</h3>
              <p className="text-neutral-600 text-sm">{analysisResult.summary}</p>
            </div>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-center w-full mt-4 pt-2 text-sm text-neutral-500 hover:text-neutral-700"
            >
              {isExpanded ? (
                <>
                  <ChevronUp size={16} className="mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown size={16} className="mr-1" />
                  Show More Details
                </>
              )}
            </button>
            
            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">Article Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Source:</span>
                        <span className="font-medium">{currentArticle.source}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Author:</span>
                        <span>{currentArticle.author}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Published:</span>
                        <span>{formatDate(currentArticle.publishedDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Objectivity Score:</span>
                        <span className="font-medium">{(analysisResult.objectivityScore * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Readability Score:</span>
                        <span className="font-medium">{(analysisResult.readabilityScore * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Key Themes</h3>
                    <div className="space-y-3">
                      {analysisResult.themes.map((theme, index) => (
                        <div key={index} className="text-sm border-l-2 border-primary-300 pl-3">
                          <div className="font-medium">{theme.name}</div>
                          <div className="text-xs text-neutral-500">
                            Keywords: {theme.keywords.join(', ')}
                          </div>
                          <div className="text-xs mt-1">
                            <span className="text-neutral-500">Relevance: </span>
                            <span className="font-medium">{(theme.relevance * 100).toFixed(0)}%</span>
                            <span className="text-neutral-500 ml-2">Sentiment: </span>
                            <span className={`font-medium ${
                              theme.sentiment > 0.1 ? 'text-success-600' : 
                              theme.sentiment < -0.1 ? 'text-error-600' : 'text-neutral-600'
                            }`}>
                              {theme.sentiment > 0.1 ? 'Positive' : 
                               theme.sentiment < -0.1 ? 'Negative' : 'Neutral'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="card">
              <h3 className="text-lg font-medium mb-4">Political Bias Analysis</h3>
              <BiasScale 
                score={analysisResult.bias.score} 
                confidence={analysisResult.bias.confidence}
                size="lg"
              />
              
              <div className="mt-4 pt-4 border-t border-neutral-200 text-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-neutral-500">Bias Score:</span>
                  <span className="font-medium">{analysisResult.bias.score.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Confidence:</span>
                  <span className="font-medium">{(analysisResult.bias.confidence * 100).toFixed(0)}%</span>
                </div>
                
                {analysisResult.bias.confidence < 0.7 && (
                  <div className="flex items-start mt-3 text-warning-700 bg-warning-50 p-3 rounded-md">
                    <AlertCircle size={16} className="mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-xs">
                      Low confidence score indicates that the bias assessment may not be fully reliable for this article.
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-medium mb-4">Sentiment Analysis</h3>
              <SentimentChart sentiment={analysisResult.sentiment} size="lg" />
            </div>
          </div>
          
          <div className="card mb-6">
            <KeywordCloud keywords={analysisResult.keywords} maxDisplay={20} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleAnalysis;