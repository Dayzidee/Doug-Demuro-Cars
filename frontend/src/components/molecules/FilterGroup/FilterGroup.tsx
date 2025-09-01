import React from 'react';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterGroupProps {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (value: string) => void;
  counts?: { [key: string]: number };
}

const FilterGroup: React.FC<FilterGroupProps> = ({ title, options, selectedValues, onChange, counts }) => {
  return (
    <div>
      <h3 className="font-semibold mb-2 text-charcoal">{title}</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center justify-between cursor-pointer text-gray-700 hover:text-charcoal">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                value={option.value}
                checked={selectedValues.includes(option.value)}
                onChange={() => onChange(option.value)}
              />
              <span>{option.label}</span>
            </div>
            {counts && (
              <span className="text-sm text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                {counts[option.value] || 0}
              </span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterGroup;
