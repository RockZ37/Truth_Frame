import React from 'react';
import { Article } from '../../types/analysisTypes';
import { Clock, Globe, User } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onClick?: () => void;
  isSelected?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ 
  article, 
  onClick,
  isSelected = false
}) => {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Get source color
  const getSourceColor = (source: string): string => {
    const sourceMap: Record<string, string> = {
      'CNN': 'bg-primary-100 text-primary-800',
      'Fox News': 'bg-accent-100 text-accent-800',
      'The New York Times': 'bg-secondary-100 text-secondary-800',
      'BBC': 'bg-neutral-100 text-neutral-800',
    };
    
    return sourceMap[source] || 'bg-neutral-100 text-neutral-800';
  };
  
  return (
    <div 
      className={`card hover:shadow-lg transition-all duration-200 cursor-pointer ${
        isSelected ? 'ring-2 ring-primary-500 shadow-md' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col h-full">
        <div>
          <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium mb-2 ${getSourceColor(article.source)}`}>
            {article.source}
          </span>
          <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
          <p className="text-neutral-600 text-sm mb-4">{article.snippet}</p>
        </div>
        
        <div className="mt-auto pt-4 border-t border-neutral-100">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <div className="flex items-center">
              <User size={12} className="mr-1" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center">
              <Clock size={12} className="mr-1" />
              <span>{formatDate(article.publishedDate)}</span>
            </div>
            <div className="flex items-center">
              <Globe size={12} className="mr-1" />
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Source
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;