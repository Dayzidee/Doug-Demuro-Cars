import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './RangeSlider.css';

interface RangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) | number[] => void;
  formatTooltip?: (value: number) => string;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ min, max, value, onChange, formatTooltip }) => {
  return (
    <Slider
      range
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      allowCross={false}
      handleStyle={[{ borderColor: '#111111' }, { borderColor: '#111111' }]}
      trackStyle={{ backgroundColor: '#111111' }}
      railStyle={{ backgroundColor: '#e5e7eb' }}
      // The custom styles are primarily handled by the imported CSS file,
      // but some props are needed for handle-specific overrides.
    />
  );
};

export default RangeSlider;
