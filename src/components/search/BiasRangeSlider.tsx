import React from 'react';

interface BiasRangeSliderProps {
  minBias: number;
  maxBias: number;
  onBiasRangeChange: (min: number, max: number) => void;
}

const BiasRangeSlider: React.FC<BiasRangeSliderProps> = ({
  minBias,
  maxBias,
  onBiasRangeChange,
}) => {
  // Convert -1 to 1 scale to 0-100 for the slider
  const normalizedMin = ((minBias + 1) / 2) * 100;
  const normalizedMax = ((maxBias + 1) / 2) * 100;
  
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNormalizedMin = parseInt(e.target.value);
    // Convert back to -1 to 1 scale
    const newMinBias = (newNormalizedMin / 100) * 2 - 1;
    onBiasRangeChange(newMinBias, maxBias);
  };
  
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNormalizedMax = parseInt(e.target.value);
    // Convert back to -1 to 1 scale
    const newMaxBias = (newNormalizedMax / 100) * 2 - 1;
    onBiasRangeChange(minBias, newMaxBias);
  };
  
  // Get leaning label based on bias value
  const getLeaningLabel = (bias: number): string => {
    if (bias <= -0.6) return 'Very Left';
    if (bias <= -0.2) return 'Somewhat Left';
    if (bias < 0.2) return 'Center';
    if (bias < 0.6) return 'Somewhat Right';
    return 'Very Right';
  };
  
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-neutral-700 mb-2">Bias Range</h3>
      
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-xs text-primary-700">Left</span>
          <span className="text-xs text-neutral-500">Center</span>
          <span className="text-xs text-accent-500">Right</span>
        </div>
        
        <div className="relative h-4 mb-4">
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-primary-600 via-neutral-200 to-accent-500"></div>
          </div>
          
          <input
            type="range"
            min="0"
            max="100"
            value={normalizedMin}
            onChange={handleMinChange}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <input
            type="range"
            min="0"
            max="100"
            value={normalizedMax}
            onChange={handleMaxChange}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div
            className="absolute top-0 h-full bg-white bg-opacity-50 pointer-events-none"
            style={{
              left: `${normalizedMin}%`,
              right: `${100 - normalizedMax}%`,
            }}
          ></div>
          
          <div
            className="absolute top-0 h-4 w-4 bg-primary-600 rounded-full shadow-md -ml-2 pointer-events-none"
            style={{ left: `${normalizedMin}%` }}
          ></div>
          
          <div
            className="absolute top-0 h-4 w-4 bg-accent-500 rounded-full shadow-md -mr-2 pointer-events-none"
            style={{ left: `${normalizedMax}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <div className="text-xs">
          <span className="text-neutral-500">Min: </span>
          <span className="font-medium">{getLeaningLabel(minBias)}</span>
        </div>
        <div className="text-xs">
          <span className="text-neutral-500">Max: </span>
          <span className="font-medium">{getLeaningLabel(maxBias)}</span>
        </div>
      </div>
    </div>
  );
};

export default BiasRangeSlider;