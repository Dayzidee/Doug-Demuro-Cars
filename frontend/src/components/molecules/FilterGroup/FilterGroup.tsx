import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

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
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="py-md border-t border-glass">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left"
      >
        <h3 className="font-heading text-lg text-white">{title}</h3>
        <ChevronDown
          size={20}
          className={`transition-transform duration-300 text-white ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-96 mt-sm' : 'max-h-0'
        }`}
      >
        <div className="space-y-sm pt-sm">
            {options.map((option) => (
              <label key={option.value} className="flex items-center justify-between cursor-pointer text-neutral-metallic-silver/80 hover:text-white transition-colors">
                <div className="flex items-center space-x-sm">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-glass bg-backgrounds-card text-primary-electric-cyan focus:ring-primary-electric-cyan/50 focus:ring-offset-backgrounds-card"
                    value={option.value}
                    checked={selectedValues.includes(option.value)}
                    onChange={() => onChange(option.value)}
                  />
                  <span>{option.label}</span>
                </div>
                {counts && (
                  <span className="text-xs text-primary-deep-blue bg-secondary-golden-yellow px-sm py-xs rounded-full font-bold">
                    {counts[option.value] || 0}
                  </span>
                )}
              </label>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FilterGroup;
