import React from 'react';

interface BiasScaleProps {
  score: number; // -1 (very left) to 1 (very right)
  confidence: number; // 0 to 1
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

const BiasScale: React.FC<BiasScaleProps> = ({ 
  score, 
  confidence,
  size = 'md',
  showLabels = true 
}) => {
  // Normalize score to 0-100 range for positioning
  const normalizedPosition = ((score + 1) / 2) * 100;
  
  // Determine size classes
  const heightClass = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  }[size];
  
  const markerSizeClass = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }[size];
  
  const fontSizeClass = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }[size];
  
  // Get color based on confidence
  const confidenceColor = confidence >= 0.8 
    ? 'bg-primary-600' 
    : confidence >= 0.5 
    ? 'bg-warning-500' 
    : 'bg-neutral-400';
  
  // Get leaning label based on score
  const getLeaningLabel = (score: number): string => {
    if (score <= -0.6) return 'Left';
    if (score <= -0.2) return 'Center-Left';
    if (score <= 0.2) return 'Center';
    if (score <= 0.6) return 'Center-Right';
    return 'Right';
  };
  
  return (
    <div className="w-full">
      <div className="relative w-full">
        {/* Gradient background */}
        <div className={`w-full ${heightClass} rounded-full overflow-hidden`}>
          <div className="w-full h-full bg-gradient-to-r from-primary-700 via-neutral-200 to-accent-500"></div>
        </div>
        
        {/* Position marker */}
        <div 
          className={`absolute top-1/2 transform -translate-y-1/2 ${markerSizeClass} ${confidenceColor} rounded-full border-2 border-white shadow-md transition-all duration-500 ease-in-out`}
          style={{ left: `calc(${normalizedPosition}% - 8px)` }}
        ></div>
      </div>
      
      {showLabels && (
        <div className="flex justify-between mt-1">
          <span className={`${fontSizeClass} text-primary-700 font-medium`}>Left</span>
          <span className={`${fontSizeClass} text-neutral-500 font-medium`}>Center</span>
          <span className={`${fontSizeClass} text-accent-500 font-medium`}>Right</span>
        </div>
      )}
      
      <div className="text-center mt-2">
        <span className={`${fontSizeClass} font-medium`}>
          {getLeaningLabel(score)}
          {confidence >= 0.7 ? '' : ' (Low Confidence)'}
        </span>
      </div>
    </div>
  );
};

export default BiasScale;