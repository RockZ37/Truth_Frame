import React from 'react';
import { KeywordData } from '../../types/analysisTypes';

interface KeywordCloudProps {
  keywords: KeywordData[];
  maxDisplay?: number;
}

const KeywordCloud: React.FC<KeywordCloudProps> = ({ 
  keywords,
  maxDisplay = 15
}) => {
  // Sort by relevance and limit to maxDisplay
  const displayKeywords = [...keywords]
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, maxDisplay);
  
  // Get font size based on relevance
  const getFontSize = (relevance: number): string => {
    if (relevance >= 0.9) return 'text-xl font-semibold';
    if (relevance >= 0.8) return 'text-lg font-semibold';
    if (relevance >= 0.7) return 'text-base font-medium';
    if (relevance >= 0.6) return 'text-sm font-medium';
    return 'text-xs';
  };
  
  // Get color based on sentiment
  const getSentimentColor = (sentiment: number): string => {
    if (sentiment >= 0.4) return 'text-success-600';
    if (sentiment >= 0.1) return 'text-success-500';
    if (sentiment > -0.1) return 'text-neutral-700';
    if (sentiment > -0.4) return 'text-error-500';
    return 'text-error-600';
  };
  
  return (
    <div className="w-full">
      <h4 className="font-medium mb-2">Key Topics & Themes</h4>
      <div className="flex flex-wrap items-center justify-center gap-3 py-4">
        {displayKeywords.map((keyword, index) => (
          <span 
            key={index}
            className={`${getFontSize(keyword.relevance)} ${getSentimentColor(keyword.sentiment)} px-2 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-default`}
            title={`Relevance: ${(keyword.relevance * 100).toFixed(0)}%, Sentiment: ${(keyword.sentiment * 100).toFixed(0)}%`}
          >
            {keyword.text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default KeywordCloud;