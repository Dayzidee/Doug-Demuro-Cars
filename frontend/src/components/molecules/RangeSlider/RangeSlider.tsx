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

const themeColors = {
    rail: 'rgba(255, 255, 255, 0.1)', // bg-glass
    track: 'linear-gradient(135deg, #0D1B2A 0%, #00BFFF 100%)', // primary-gradient
    handleBorder: '#00BFFF', // primary-electric-cyan
    tooltipBg: '#0D1B2A', // primary-deep-blue
};

const RangeSlider: React.FC<RangeSliderProps> = ({ min, max, value, onChange, formatTooltip }) => {
  const handleChange = (newValue: number | number[]) => {
    onChange(newValue as [number, number]);
  };

  const handleRender: SliderProps['handleRender'] = (node, props) => {
    const tip = formatTooltip ? formatTooltip(props.value) : props.value;
    return React.cloneElement(node, { 'aria-label': 'slider-handle', 'aria-valuetext': tip });
  };

  return (
    <Slider
      range
      min={min}
      max={max}
      value={value}
      onChange={handleChange}
      allowCross={false}
      railStyle={{ backgroundColor: themeColors.rail, height: '6px' }}
      trackStyle={{ background: themeColors.track, height: '6px' }}
      handleStyle={[
        { backgroundColor: 'white', border: `2px solid ${themeColors.handleBorder}` },
        { backgroundColor: 'white', border: `2px solid ${themeColors.handleBorder}` },
      ]}
      handleRender={handleRender}
      className="touch-none"
    />
  );
};

export default RangeSlider;
