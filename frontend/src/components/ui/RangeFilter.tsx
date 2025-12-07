import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import useDebounce from "@/hooks/useDebounce";

interface RangeFilterProps {
  minLimit: number;
  maxLimit: number;
  initialStartValue: number;
  initialEndValue: number;
  onRangeChange: (start: number, end: number) => void;
}

function RangeFilter({
  minLimit,
  maxLimit,
  initialStartValue,
  initialEndValue,
  onRangeChange,
}: RangeFilterProps) {
  const [isRangeMode, setIsRangeMode] = useState(true);
  const [currentStart, setCurrentStart] = useState(initialStartValue);
  const [currentEnd, setCurrentEnd] = useState(initialEndValue);

  useEffect(() => {
    setCurrentStart(initialStartValue);
    setCurrentEnd(initialEndValue);
  }, [initialStartValue, initialEndValue]);

  const debouncedCurrentStart = useDebounce(currentStart, 500);
  const debouncedCurrentEnd = useDebounce(currentEnd, 500);

  const handleSliderValueChange = (values: number[]) => {
    if (isRangeMode) {
      const [newStart, newEnd] = values;
      setCurrentStart(newStart);
      setCurrentEnd(newEnd);
    } else {
      const newStart = values[0];
      setCurrentStart(newStart);
    }
  };

  useEffect(() => {
    if (
      debouncedCurrentStart !== initialStartValue ||
      debouncedCurrentEnd !== initialEndValue
    )
      onRangeChange(debouncedCurrentStart, debouncedCurrentEnd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedCurrentStart, debouncedCurrentEnd]);

  const toggleRangeMode = () => {
    setIsRangeMode((prev) => {
      const newMode = !prev;
      if (!newMode) {
        setCurrentEnd(maxLimit);
      } else {
        if (currentStart > initialEndValue) {
          setCurrentEnd(currentStart);
        } else {
          setCurrentEnd(initialEndValue);
        }
      }
      return newMode;
    });
  };

  const sliderValue = isRangeMode
    ? [currentStart, currentEnd]
    : [currentStart, maxLimit];

  return (
    <div className="p-2">
      <div className="mb-4">
        <label className="text-gray-30 mb-2 block text-sm font-medium">
          {isRangeMode
            ? `Range: ${currentStart} - ${currentEnd}`
            : `Min: ${currentStart}`}
        </label>
        <Slider
          min={minLimit}
          max={maxLimit}
          step={1}
          value={sliderValue}
          onValueChange={handleSliderValueChange}
          minStepsBetweenThumbs={isRangeMode ? 0 : 1}
          className="w-full"
        />
      </div>

      <div className="flex items-center justify-end">
        <button
          onClick={toggleRangeMode}
          className="text-gray-20 text-xs hover:underline"
        >
          Mode: {isRangeMode ? "Start & End" : "Just Start"}
        </button>
      </div>
    </div>
  );
}

export default RangeFilter;
