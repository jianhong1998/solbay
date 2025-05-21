import {
  ChangeEventHandler,
  forwardRef,
  HTMLAttributes,
  KeyboardEventHandler,
} from 'react';

type NumberInputProps = HTMLAttributes<HTMLInputElement> & {
  value: number;
  setValue: (value: number) => void;
  label?: string;
  labelClassName?: string;
  disabled?: boolean;
  placeholder?: string;
  helperText?: string;
  error?: string;
  onEnterPressed?: () => void;
  maxDigit?: number;
  minValue?: number;
  presentZero?: boolean;
};

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      setValue,
      onEnterPressed,
      labelClassName,
      label,
      className,
      placeholder,
      value,
      disabled,
      error,
      helperText,
      maxDigit = 9,
      minValue,
      presentZero = false,
      ...props
    },
    ref,
  ) => {
    const handleOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      const valueString = e.target.value;
      const value = Number(valueString);

      if (Number.isNaN(value) || valueString.length > maxDigit) return;
      if (typeof minValue === 'number' && value < minValue) return;

      setValue(value);
    };

    const handleKeyUpEvent: KeyboardEventHandler<HTMLInputElement> = (e) => {
      if (e.key.toLowerCase() === 'enter' && onEnterPressed) {
        onEnterPressed();
      }
    };

    return (
      <>
        {Boolean(label) && (
          <label className={`label label-text font-bold ${labelClassName}`}>
            {label}
          </label>
        )}
        <input
          {...props}
          type="text"
          className={[
            'input input-bordered rounded-md bg-white text-black',
            className,
          ].join(' ')}
          placeholder={placeholder}
          ref={ref}
          value={value === 0 && !presentZero ? '' : value}
          disabled={disabled}
          onChange={handleOnChange}
          onKeyUp={handleKeyUpEvent}
        />
        {Boolean(helperText) && <p className="label">{helperText}</p>}
        {Boolean(error) && (
          <p className="label label-text text-red-500 font-semibold">{error}</p>
        )}
      </>
    );
  },
);

export default NumberInput;
