import React from "react";
import { Minus, Plus } from "lucide-react";

interface NumberInputStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
  inputClassName?: string;
}

const NumberInputStepper: React.FC<NumberInputStepperProps> = ({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  placeholder,
  prefix,
  suffix,
  className = "",
  inputClassName = "",
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      onChange(val);
    } else if (e.target.value === "") {
      onChange(min);
    }
  };

  const handleStep = (delta: number) => {
    let newValue = value + delta * step;
    if (newValue < min) newValue = min;
    if (newValue > max) newValue = max;
    onChange(Number(newValue.toFixed(6)));
  };

  return (
    <div
      className={`flex items-center rounded-md border border-zinc-200 dark:border-zinc-700 bg-background focus-within:ring-2 focus-within:ring-primary/30 transition-all duration-200 ${className}`}
    >
      {prefix && (
        <span className="pl-2 sm:pl-3 text-xs sm:text-sm text-muted-foreground font-medium">
          {prefix}
        </span>
      )}
      <button
        type="button"
        aria-label="Decrease"
        onClick={() => handleStep(-1)}
        className="px-2 sm:px-3 py-2 sm:py-3 text-zinc-500 hover:text-primary hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 min-h-[44px] touch-manipulation rounded-l-md"
        disabled={value <= min}
      >
        <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-16 sm:w-20 text-center bg-transparent border-0 focus:ring-0 text-xs sm:text-sm h-9 sm:h-10 font-medium ${inputClassName}`}
      />
      <button
        type="button"
        aria-label="Increase"
        onClick={() => handleStep(1)}
        className="px-2 sm:px-3 py-2 sm:py-3 text-zinc-500 hover:text-primary hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 min-h-[44px] touch-manipulation rounded-r-md"
        disabled={value >= max}
      >
        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>
      {suffix && (
        <span className="pr-2 sm:pr-3 text-xs sm:text-sm text-muted-foreground font-medium">
          {suffix}
        </span>
      )}
    </div>
  );
};

export default NumberInputStepper;
