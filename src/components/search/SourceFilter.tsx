import React from 'react';
import { Check, X } from 'lucide-react';

interface SourceFilterProps {
  sources: string[];
  selectedSources: string[];
  onSourceToggle: (source: string) => void;
}

const SourceFilter: React.FC<SourceFilterProps> = ({ 
  sources, 
  selectedSources, 
  onSourceToggle 
}) => {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-neutral-700 mb-2">News Sources</h3>
      <div className="flex flex-wrap gap-2">
        {sources.map((source) => (
          <button
            key={source}
            onClick={() => onSourceToggle(source)}
            className={`
              inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium
              ${selectedSources.includes(source) 
                ? 'bg-primary-100 text-primary-800 hover:bg-primary-200' 
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}
              transition-colors
            `}
          >
            {source}
            {selectedSources.includes(source) ? (
              <X size={12} className="ml-1" />
            ) : (
              <Check size={12} className="ml-1 opacity-0 group-hover:opacity-100" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SourceFilter;