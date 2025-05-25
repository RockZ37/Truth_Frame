import React, { useState, useEffect } from 'react';
import { useAnalysis } from '../context/AnalysisContext';
import BiasRangeSlider from '../components/search/BiasRangeSlider';
import SourceFilter from '../components/search/SourceFilter';
import DateRangeFilter from '../components/search/DateRangeFilter';
import { Loader, Search as SearchIcon, Filter, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [minBias, setMinBias] = useState(-1);
  const [maxBias, setMaxBias] = useState(1);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const { 
    isLoading, 
    error, 
    searchResults, 
    searchTopics, 
    clearError 
  } = useAnalysis();

  useEffect(() => {
    // Set page title
    document.title = 'Search | Truth_Frame';
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const filters = {
        biasRange: { min: minBias, max: maxBias },
        sources: selectedSources.length > 0 ? selectedSources : undefined,
        dateRange: startDate && endDate ? { start: startDate, end: endDate } : undefined
      };
      searchTopics(query, filters);
    }
  };
  
  const handleSourceToggle = (source: string) => {
    if (selectedSources.includes(source)) {
      setSelectedSources(selectedSources.filter(s => s !== source));
    } else {
      setSelectedSources([...selectedSources, source]);
    }
  };
  
  const handleBiasRangeChange = (min: number, max: number) => {
    setMinBias(min);
    setMaxBias(max);
  };
  
  const handleClearFilters = () => {
    setMinBias(-1);
    setMaxBias(1);
    setSelectedSources([]);
    setStartDate('');
    setEndDate('');
  };
  
  // Available sources for filter
  const availableSources = [
    'CNN', 'Fox News', 'The New York Times', 'Washington Post', 
    'Wall Street Journal', 'MSNBC', 'NBC News', 'ABC News',
    'CBS News', 'BBC', 'Reuters', 'Associated Press'
  ];
  
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Search Analysis</h1>
        <p className="text-neutral-600">
          Search for analysis of specific topics across different news sources.
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
        <form onSubmit={handleSearch}>
          <div className="flex mb-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="text"
                placeholder="Search topics (e.g., climate change, elections, economy)"
                className="input pl-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary ml-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </button>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-sm text-neutral-600 hover:text-neutral-800"
            >
              <Filter size={16} className="mr-1" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            {showFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
              >
                <X size={14} className="mr-1" />
                Clear Filters
              </button>
            )}
          </div>
          
          {showFilters && (
            <div className="bg-neutral-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <BiasRangeSlider 
                    minBias={minBias}
                    maxBias={maxBias}
                    onBiasRangeChange={handleBiasRangeChange}
                  />
                </div>
                
                <div>
                  <SourceFilter 
                    sources={availableSources}
                    selectedSources={selectedSources}
                    onSourceToggle={handleSourceToggle}
                  />
                </div>
                
                <div>
                  <DateRangeFilter 
                    startDate={startDate}
                    endDate={endDate}
                    onStartDateChange={setStartDate}
                    onEndDateChange={setEndDate}
                  />
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
      
      {isLoading && searchResults.length === 0 && (
        <div className="card flex flex-col items-center justify-center py-12">
          <Loader className="w-10 h-10 text-primary-500 animate-spin mb-4" />
          <h2 className="text-lg font-medium mb-2">Searching...</h2>
          <p className="text-neutral-500 text-center max-w-md">
            Looking for analysis on "{query}"...
          </p>
        </div>
      )}
      
      {searchResults.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Search Results for "{query}"</h2>
          
          <div className="grid grid-cols-1 gap-4">
            {searchResults.map((result) => (
              <div key={result.id} className="card hover:shadow-lg transition-all">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold mb-2">{result.topic}</h3>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {result.sources.slice(0, 4).map((source, i) => (
                        <span 
                          key={i}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800"
                        >
                          {source}
                        </span>
                      ))}
                      {result.sources.length > 4 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700">
                          +{result.sources.length - 4} more
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-neutral-500 block">Bias Range:</span>
                        <span className="font-medium">
                          {result.biasRange.min.toFixed(1)} to {result.biasRange.max.toFixed(1)}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">Sentiment:</span>
                        <span className={`font-medium ${
                          result.sentimentRange.avg > 0.1 ? 'text-success-600' : 
                          result.sentimentRange.avg < -0.1 ? 'text-error-600' : 'text-neutral-600'
                        }`}>
                          {result.sentimentRange.avg > 0.3 ? 'Very Positive' :
                           result.sentimentRange.avg > 0.1 ? 'Somewhat Positive' :
                           result.sentimentRange.avg < -0.3 ? 'Very Negative' :
                           result.sentimentRange.avg < -0.1 ? 'Somewhat Negative' : 'Neutral'}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">Articles:</span>
                        <span className="font-medium">{result.articleCount}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">Updated:</span>
                        <span>{formatDate(result.lastUpdated)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 md:ml-6">
                    <Link 
                      to={`/compare?topic=${encodeURIComponent(result.topic)}`}
                      className="btn btn-primary"
                    >
                      View Analysis
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {!isLoading && searchResults.length === 0 && query && (
        <div className="card py-12 flex flex-col items-center justify-center text-center">
          <SearchIcon className="w-12 h-12 text-neutral-300 mb-4" />
          <h2 className="text-xl font-medium mb-2">No results found</h2>
          <p className="text-neutral-600 max-w-md mb-6">
            We couldn't find any analysis for "{query}". Try using different keywords or fewer filters.
          </p>
          <div className="flex space-x-4">
            <button 
              onClick={handleClearFilters}
              className="btn btn-outline"
            >
              Clear Filters
            </button>
            <Link to="/analyze" className="btn btn-primary">
              Analyze New Topic
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;