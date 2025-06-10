import { ChangeEventHandler, forwardRef, HTMLAttributes, useRef } from 'react';

type DatePickerProps = HTMLAttributes<HTMLDivElement> & {
  value: Date;
  setValue: (value: Date) => void;
  label?: string;
  labelClassName?: string;
  disabled?: boolean;
  placeholder?: string;
  helperText?: string;
  error?: string;
  min?: string;
  max?: string;
};

const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      setValue,
      value,
      disabled,
      className,
      placeholder,
      label,
      labelClassName,
      helperText,
      error,
      id,
      min,
      max,
      ...props
    },
    ref,
  ) => {
    // Format date to YYYY-MM-DD for the input value
    const formattedValue = value ? value.toISOString().split('T')[0] : '';
    const inputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      if (e.target.value) {
        setValue(new Date(e.target.value));
      }
    };

    // Create a custom input that looks like a date input but is actually a div with a hidden date input
    return (
      <div
        className="form-control w-full"
        ref={ref}
        {...props}
      >
        {Boolean(label) && (
          <label className={`label label-text font-bold ${labelClassName}`}>
            {label}
          </label>
        )}

        <div
          ref={wrapperRef}
          className="relative cursor-pointer"
          onClick={() => {
            if (inputRef.current && !disabled) {
              // Focus and open the date picker
              inputRef.current.focus();
              inputRef.current.showPicker?.();
            }
          }}
        >
          {/* Display value in a styled div that looks like an input */}
          <div
            className={`
            input input-bordered rounded-md bg-white text-black w-full flex items-center
            ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
            ${className || ''}
          `}
          >
            <span className="flex-grow">
              {formattedValue
                ? new Date(formattedValue).toLocaleDateString()
                : placeholder || 'Select date'}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>

          {/* Actual date input - hidden but accessible */}
          <input
            ref={inputRef}
            type="date"
            className="opacity-0 absolute top-0 left-0 w-full h-full cursor-pointer"
            value={formattedValue}
            disabled={disabled}
            onChange={handleOnChange}
            min={min}
            max={max}
            id={id as string}
            aria-hidden="false"
          />
        </div>

        {Boolean(helperText) && <p className="label">{helperText}</p>}
        {Boolean(error) && (
          <p className="label label-text text-red-500 font-semibold">{error}</p>
        )}
      </div>
    );
  },
);

export default DatePicker;
