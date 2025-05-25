import React, { useState, useEffect } from 'react';
import { useAnalysis } from '../context/AnalysisContext';
import ArticleCard from '../components/analysis/ArticleCard';
import BiasScale from '../components/analysis/BiasScale';
import SourceComparisonChart from '../components/analysis/SourceComparisonChart';
import { Loader, PieChart, BarChart3, SplitSquareVertical } from 'lucide-react';

const SourceComparison: React.FC = () => {
  const [urls, setUrls] = useState<string[]>(['', '', '']);
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState('overview');
  
  const { 
    isLoading, 
    error, 
    comparisonResult, 
    compareArticles, 
    clearError 
  } = useAnalysis();

  useEffect(() => {
    // Set page title
    document.title = 'Source Comparison | Truth_Frame';
  }, []);
  
  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };
  
  const handleAddUrl = () => {
    setUrls([...urls, '']);
  };
  
  const handleRemoveUrl = (index: number) => {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    setUrls(newUrls);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validUrls = urls.filter(url => url.trim() !== '');
    if (validUrls.length >= 2) {
      compareArticles(validUrls);
    }
  };
  
  const handlePresetClick = () => {
    const presetUrls = [
      'https://www.cnn.com/example',
      'https://www.foxnews.com/example',
      'https://www.nytimes.com/example'
    ];
    setUrls(presetUrls);
    compareArticles(presetUrls);
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Source Comparison</h1>
        <p className="text-neutral-600">
          Compare how different news sources cover the same topic to identify bias and unique perspectives.
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
            <label className="label">
              Enter Article URLs (minimum 2 sources)
            </label>
            <div className="space-y-2">
              {urls.map((url, index) => (
                <div key={index} className="flex">
                  <input
                    type="url"
                    placeholder={`Source ${index + 1} URL`}
                    className="input rounded-r-none flex-grow"
                    value={url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveUrl(index)}
                    disabled={urls.length <= 2}
                    className="px-3 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-700"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleAddUrl}
              className="text-sm text-primary-700 hover:text-primary-800 flex items-center"
            >
              + Add Another Source
            </button>
            
            <button
              type="button"
              onClick={handlePresetClick}
              className="text-sm text-primary-700 hover:text-primary-800 flex items-center"
            >
              Use Demo Sources
            </button>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || urls.filter(url => url.trim() !== '').length < 2}
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Comparing...
                </>
              ) : (
                'Compare Sources'
              )}
            </button>
          </div>
        </form>
      </div>
      
      {isLoading && !comparisonResult && (
        <div className="card flex flex-col items-center justify-center py-16">
          <Loader className="w-12 h-12 text-primary-500 animate-spin mb-4" />
          <h2 className="text-xl font-medium mb-2">Comparing Sources</h2>
          <p className="text-neutral-500 text-center max-w-md">
            Our AI is analyzing and comparing how different sources cover this topic. This may take a few moments...
          </p>
        </div>
      )}
      
      {comparisonResult && (
        <div>
          <div className="card mb-6">
            <h2 className="text-xl font-bold mb-4">
              Comparison Results: {comparisonResult.topic}
            </h2>
            
            <div className="mb-6">
              <div className="flex border-b border-neutral-200">
                <button
                  onClick={() => setSelectedTab('overview')}
                  className={`px-4 py-2 font-medium text-sm flex items-center ${
                    selectedTab === 'overview' 
                      ? 'border-b-2 border-primary-500 text-primary-700' 
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <PieChart size={16} className="mr-2" />
                  Overview
                </button>
                <button
                  onClick={() => setSelectedTab('topics')}
                  className={`px-4 py-2 font-medium text-sm flex items-center ${
                    selectedTab === 'topics' 
                      ? 'border-b-2 border-primary-500 text-primary-700' 
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <BarChart3 size={16} className="mr-2" />
                  Topic Coverage
                </button>
                <button
                  onClick={() => setSelectedTab('narratives')}
                  className={`px-4 py-2 font-medium text-sm flex items-center ${
                    selectedTab === 'narratives' 
                      ? 'border-b-2 border-primary-500 text-primary-700' 
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <SplitSquareVertical size={16} className="mr-2" />
                  Key Narratives
                </button>
              </div>
            </div>
            
            {selectedTab === 'overview' && (
              <div>
                <h3 className="text-lg font-medium mb-4">Bias Distribution</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-base font-medium mb-2">Overall Bias Spread</h4>
                    <div className="bg-neutral-50 p-4 rounded-lg">
                      <div className="flex h-40 items-end justify-between space-x-2">
                        <div className="flex flex-col items-center">
                          <div 
                            className="w-12 bg-primary-600 rounded-t-md" 
                            style={{height: `${comparisonResult.overallBiasSpread.left * 100}%`}}
                          ></div>
                          <span className="text-xs mt-1">Left</span>
                          <span className="text-xs font-medium">
                            {(comparisonResult.overallBiasSpread.left * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div 
                            className="w-12 bg-primary-400 rounded-t-md" 
                            style={{height: `${comparisonResult.overallBiasSpread.centerLeft * 100}%`}}
                          ></div>
                          <span className="text-xs mt-1">Center-Left</span>
                          <span className="text-xs font-medium">
                            {(comparisonResult.overallBiasSpread.centerLeft * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div 
                            className="w-12 bg-neutral-400 rounded-t-md" 
                            style={{height: `${comparisonResult.overallBiasSpread.center * 100}%`}}
                          ></div>
                          <span className="text-xs mt-1">Center</span>
                          <span className="text-xs font-medium">
                            {(comparisonResult.overallBiasSpread.center * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div 
                            className="w-12 bg-accent-400 rounded-t-md" 
                            style={{height: `${comparisonResult.overallBiasSpread.centerRight * 100}%`}}
                          ></div>
                          <span className="text-xs mt-1">Center-Right</span>
                          <span className="text-xs font-medium">
                            {(comparisonResult.overallBiasSpread.centerRight * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div 
                            className="w-12 bg-accent-600 rounded-t-md" 
                            style={{height: `${comparisonResult.overallBiasSpread.right * 100}%`}}
                          ></div>
                          <span className="text-xs mt-1">Right</span>
                          <span className="text-xs font-medium">
                            {(comparisonResult.overallBiasSpread.right * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-base font-medium mb-2">Sources Analyzed</h4>
                    <div className="space-y-4">
                      {comparisonResult.sources.map((source, index) => (
                        <div key={index} className="bg-neutral-50 p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{source.name}</span>
                            <span className="text-xs text-neutral-500">
                              {source.articleCount} articles
                            </span>
                          </div>
                          <BiasScale 
                            score={source.bias.score} 
                            confidence={source.bias.confidence}
                            size="sm"
                            showLabels={false}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mb-4">Articles Analyzed</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {comparisonResult.articles.map((article, index) => (
                    <ArticleCard 
                      key={index} 
                      article={article}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {selectedTab === 'topics' && (
              <div>
                <h3 className="text-lg font-medium mb-4">Topic Coverage Comparison</h3>
                <div className="mb-6">
                  <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
                    {comparisonResult.topicCoverage.map((topic, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedTopicIndex(index)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap ${
                          selectedTopicIndex === index
                            ? 'bg-primary-100 text-primary-800'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        {topic.topic}
                      </button>
                    ))}
                  </div>
                  
                  {comparisonResult.topicCoverage[selectedTopicIndex] && (
                    <SourceComparisonChart 
                      topicCoverage={comparisonResult.topicCoverage[selectedTopicIndex]} 
                    />
                  )}
                </div>
                
                <div className="bg-neutral-50 p-4 rounded-lg mt-6">
                  <h4 className="text-base font-medium mb-3">Key Insights</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="h-5 w-5 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center text-xs mr-2 flex-shrink-0">
                        1
                      </span>
                      <span>
                        <strong>Coverage Variance:</strong> There are significant differences in how much attention each source gives to different aspects of this topic.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="h-5 w-5 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center text-xs mr-2 flex-shrink-0">
                        2
                      </span>
                      <span>
                        <strong>Bias Correlation:</strong> Sources with similar political leanings tend to emphasize similar subtopics.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="h-5 w-5 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center text-xs mr-2 flex-shrink-0">
                        3
                      </span>
                      <span>
                        <strong>Sentiment Differences:</strong> The emotional tone varies significantly across sources when discussing the same topics.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            
            {selectedTab === 'narratives' && (
              <div>
                <h3 className="text-lg font-medium mb-4">Key Narratives</h3>
                <p className="text-neutral-600 text-sm mb-4">
                  These are the main narratives identified across all sources, showing how different outlets frame the same topic.
                </p>
                
                <div className="space-y-6">
                  {comparisonResult.keyNarratives.map((narrative, index) => (
                    <div key={index} className="bg-neutral-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3">"{narrative.narrative}"</h4>
                      
                      <h5 className="text-sm text-neutral-600 mb-2">Sources promoting this narrative:</h5>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {narrative.sourcesBiasDistribution.map((source, i) => {
                          // Determine badge color based on bias
                          const getBadgeClass = (bias: number) => {
                            if (bias <= -0.6) return 'bg-primary-100 text-primary-800';
                            if (bias <= -0.2) return 'bg-primary-50 text-primary-700';
                            if (bias < 0.2) return 'bg-neutral-100 text-neutral-800';
                            if (bias < 0.6) return 'bg-accent-50 text-accent-700';
                            return 'bg-accent-100 text-accent-800';
                          };
                          
                          return (
                            <span 
                              key={i}
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeClass(source.bias)}`}
                            >
                              {source.source}
                            </span>
                          );
                        })}
                      </div>
                      
                      <div className="flex items-center">
                        <div className="flex-grow h-1 bg-neutral-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary-600 via-neutral-400 to-accent-600"
                          ></div>
                        </div>
                        <div className="ml-4 text-xs text-neutral-500">
                          Left to Right Spectrum
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SourceComparison;