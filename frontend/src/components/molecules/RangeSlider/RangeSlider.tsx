import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "./RangeSlider.css";

interface RangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number] | number[]) => void;
  formatTooltip?: (value: number) => string;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  value,
  onChange,
  formatTooltip,
}) => {
  // FIX: Create a handler function to resolve the type mismatch.
  // The `rc-slider` component expects a function with the signature `(value: number | number[]) => void`.
  // By creating this handler, we create a function that satisfies `rc-slider`'s requirement.
  // Inside it, we safely call the original `onChange` prop with the value.
  const handleChange = (newValue: number | number[]) => {
    // We pass the newValue directly to the original onChange function.
    // Since `newValue` (which will be a number[] in range mode) is compatible
    // with the `[number, number] | number[]` type, this works perfectly.
    onChange(newValue as [number, number]);
  };

  return (
    <Slider
      range
      min={min}
      max={max}
      value={value}
      // FIX: Pass our new handler function instead of the original prop.
      onChange={handleChange}
      allowCross={false}
      handleStyle={[{ borderColor: "#111111" }, { borderColor: "#111111" }]}
      trackStyle={{ backgroundColor: "#111111" }}
      railStyle={{ backgroundColor: "#e5e7eb" }}
      // The `formatTooltip` prop from rc-slider is called `tipFormatter`.
      // If you intend to use it, you would pass it like this:
      // tipFormatter={formatTooltip}
    />
  );
};

export default RangeSlider;
