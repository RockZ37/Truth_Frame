import React, { useState, useEffect } from 'react';
import { useAnalysis } from '../context/AnalysisContext';
import BiasScale from '../components/analysis/BiasScale';
import SentimentChart from '../components/analysis/SentimentChart';
import KeywordCloud from '../components/analysis/KeywordCloud';
import { Loader, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Article } from '../types/analysisTypes';

const AnalysisLoading: React.FC = () => (
  <div className="card flex flex-col items-center justify-center py-16">
    <Loader className="w-12 h-12 text-primary-500 animate-spin mb-4" />
    <h2 className="text-xl font-medium mb-2">Analyzing Article</h2>
    <p className="text-neutral-500 text-center max-w-md">
      Our AI is analyzing the article for bias, sentiment, and key themes. This may take a few moments...
    </p>
  </div>
);

const AnalysisResults: React.FC<{ article: Article }> = ({ article }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { clearAnalysis } = useAnalysis();

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return 'Date not available';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const { analysis } = article;

  return (
    <div className="card mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold mb-1">{article.title}</h2>
          <div className="flex items-center text-sm text-neutral-500 mb-2 flex-wrap">
            <span className="mr-3">{article.source || 'Source not available'}</span>
            <span className="mr-3">By {article.author || 'Author not available'}</span>
            <span>{formatDate(article.publishedDate)}</span>
          </div>
        </div>
        <button
          onClick={clearAnalysis}
          className="text-neutral-500 hover:text-neutral-700 p-1 rounded-full"
          aria-label="Clear analysis"
        >
          &times;
        </button>
      </div>

      <div className="mb-4">
        <p className="text-neutral-700">{article.snippet || 'Snippet not available.'}</p>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 hover:underline text-sm mt-2 inline-block"
        >
          View Original Article
        </a>
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-center w-full mt-4 pt-2 text-sm text-neutral-500 hover:text-neutral-700"
      >
        {isExpanded ? (
          <><ChevronUp size={16} className="mr-1" /> Show Less</>
        ) : (
          <><ChevronDown size={16} className="mr-1" /> Show More Details</>
        )}
      </button>

      {isExpanded && analysis && (
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysis.bias && (
              <div>
                <h3 className="font-medium mb-3">Bias Analysis</h3>
                <BiasScale {...analysis.bias} />
              </div>
            )}
            {analysis.sentiment && (
              <div>
                <h3 className="font-medium mb-3">Sentiment Analysis</h3>
                <SentimentChart sentiment={analysis.sentiment} />
              </div>
            )}
          </div>

          {analysis.keywords && analysis.keywords.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-3">Keyword Cloud</h3>
              <KeywordCloud keywords={analysis.keywords} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ArticleAnalysis: React.FC = () => {
  const [url, setUrl] = useState('');
  const {
    isLoading,
    error,
    currentArticle,
    analyzeArticle,
    clearError,
    clearAnalysis
  } = useAnalysis();

  useEffect(() => {
    document.title = 'Article Analysis | TruthFrame';
    return () => {
      clearAnalysis();
      clearError();
    };
  }, [clearAnalysis, clearError]);

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

  const renderContent = () => {
    if (isLoading) {
      return <AnalysisLoading />;
    }
    if (!error && currentArticle) {
      return <AnalysisResults article={currentArticle} />;
    }
    return null;
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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6 flex justify-between items-center" role="alert">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-3" />
            <span>{error}</span>
          </div>
          <button
            onClick={clearError}
            className="text-red-700 hover:text-red-800 font-bold"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      )}

      <div className="card mb-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="url" className="label">Article URL</label>
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
                  <><Loader className="animate-spin -ml-1 mr-2 h-4 w-4" /> Analyzing...</>
                ) : (
                  'Analyze'
                )}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Some Articles</h3>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => handleExampleClick('https://www.cnn.com/2023/10/26/politics/us-syria-airstrikes/index.html')} className="text-xs px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200">CNN</button>
            <button onClick={() => handleExampleClick('https://www.foxnews.com/politics/biden-admin-hit-with-lawsuit-alleging-secret-plan-fly-300k-migrants-us-every-year')} className="text-xs px-3 py-1.5 bg-red-100 text-red-800 rounded-full hover:bg-red-200">Fox News</button>
            <button onClick={() => handleExampleClick('https://www.nytimes.com/2023/10/26/us/politics/house-speaker-mike-johnson.html')} className="text-xs px-3 py-1.5 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300">NY Times</button>
          </div>
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default ArticleAnalysis;