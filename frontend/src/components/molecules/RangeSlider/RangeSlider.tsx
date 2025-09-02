import React from "react";
import Slider, { SliderProps } from "rc-slider";
import "rc-slider/assets/index.css";
import "./RangeSlider.css";

interface RangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number] | number[]) => void;
  formatTooltip?: (value: number) => React.ReactNode;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ min, max, value, onChange, formatTooltip }) => {
  const handleChange = (newValue: number | number[]) => {
    onChange(newValue as [number, number]);
  };

  const handleRender: SliderProps['handleRender'] = (node, props) => {
    return (
      <div className="relative group">
        <div className="absolute bottom-full mb-sm left-1/2 -translate-x-1/2 px-sm py-xs bg-primary-deep-blue text-white text-xs rounded-md opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {formatTooltip ? formatTooltip(props.value) : props.value}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-primary-deep-blue"></div>
        </div>
        {node}
      </div>
    );
  };

  return (
    <Slider
      range
      min={min}
      max={max}
      value={value}
      onChange={handleChange}
      allowCross={false}
      railStyle={{ backgroundColor: "rgba(255, 255, 255, 0.1)" /* bg-glass */ }}
      trackStyle={{ background: "linear-gradient(135deg, #FF7A18 0%, #FFC837 100%)" /* secondary-gradient */ }}
      handleStyle={[
        { backgroundColor: 'white', border: '2px solid #FFC837' /* secondary-golden-yellow */ },
        { backgroundColor: 'white', border: '2px solid #FFC837' /* secondary-golden-yellow */ },
      ]}
      handleRender={handleRender}
    />
  );
};

export default RangeSlider;
