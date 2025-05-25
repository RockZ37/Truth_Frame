import React from 'react';
import { TrendingTopic } from '../../types/analysisTypes';
import { ExternalLink, TrendingUp } from 'lucide-react';

interface TopicOverviewProps {
  topic: TrendingTopic;
}

const TopicOverview: React.FC<TopicOverviewProps> = ({ topic }) => {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Get momentum value text and class
  const getMomentumInfo = (momentum: number) => {
    if (momentum >= 0.8) return { text: 'Very High', class: 'text-success-600' };
    if (momentum >= 0.6) return { text: 'High', class: 'text-success-500' };
    if (momentum >= 0.4) return { text: 'Moderate', class: 'text-warning-500' };
    if (momentum >= 0.2) return { text: 'Low', class: 'text-error-400' };
    return { text: 'Very Low', class: 'text-error-500' };
  };
  
  // Get bias variance info
  const getBiasVarianceInfo = (variance: number) => {
    if (variance >= 0.8) return { text: 'Very High', class: 'text-error-500' };
    if (variance >= 0.6) return { text: 'High', class: 'text-error-400' };
    if (variance >= 0.4) return { text: 'Moderate', class: 'text-warning-500' };
    if (variance >= 0.2) return { text: 'Low', class: 'text-success-500' };
    return { text: 'Very Low', class: 'text-success-600' };
  };
  
  // Get dominant leaning badge class
  const getLeaningBadgeClass = (leaning: string) => {
    const leaningMap: Record<string, string> = {
      'left': 'bg-primary-100 text-primary-800',
      'center-left': 'bg-primary-50 text-primary-700',
      'center': 'bg-neutral-100 text-neutral-800',
      'center-right': 'bg-accent-50 text-accent-700',
      'right': 'bg-accent-100 text-accent-800',
      'unknown': 'bg-neutral-100 text-neutral-600',
    };
    
    return leaningMap[leaning] || 'bg-neutral-100 text-neutral-600';
  };
  
  const momentumInfo = getMomentumInfo(topic.momentum);
  const biasVarianceInfo = getBiasVarianceInfo(topic.biasVariance);
  
  return (
    <div className="card hover:shadow-lg transition-all cursor-pointer">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold mb-3">{topic.topic}</h3>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLeaningBadgeClass(topic.dominantLeaning)}`}>
          {topic.dominantLeaning.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </span>
      </div>
      
      <div className="flex flex-col space-y-2 mt-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-600">Momentum:</span>
          <span className={`text-sm font-medium flex items-center ${momentumInfo.class}`}>
            <TrendingUp size={14} className="mr-1" />
            {momentumInfo.text}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-600">Bias Variance:</span>
          <span className={`text-sm font-medium ${biasVarianceInfo.class}`}>{biasVarianceInfo.text}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-600">Sources:</span>
          <span className="text-sm font-medium">{topic.sourceCount} outlets</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-600">Last Updated:</span>
          <span className="text-sm">{formatDate(topic.lastUpdated)}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-neutral-100">
        <button className="flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium">
          View Analysis
          <ExternalLink size={14} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default TopicOverview;