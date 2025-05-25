import React from 'react';

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-neutral-700 mb-2">Date Range</h3>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor="start-date" className="block text-xs text-neutral-500 mb-1">
            From
          </label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="input py-1 text-sm"
          />
        </div>
        <div>
          <label htmlFor="end-date" className="block text-xs text-neutral-500 mb-1">
            To
          </label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="input py-1 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default DateRangeFilter;