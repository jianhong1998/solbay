'use client';

import {
  ChangeEventHandler,
  forwardRef,
  HTMLAttributes,
  KeyboardEventHandler,
  useState,
} from 'react';

type PriceInputProps = HTMLAttributes<HTMLInputElement> & {
  value: number;
  setValue: (value: number) => void;
  label?: string;
  labelClassName?: string;
  inputClassName?: string;
  inputContainerClassName?: string;
  disabled?: boolean;
  placeholder?: string;
  helperText?: string;
  error?: string;
  onEnterPressed?: () => void;
};

const PriceInput = forwardRef<HTMLInputElement, PriceInputProps>(
  (
    {
      onEnterPressed,
      setValue,
      value,
      disabled,
      className,
      placeholder,
      label,
      labelClassName,
      helperText,
      error,
      inputClassName,
      inputContainerClassName,
      ...props
    },
    ref,
  ) => {
    const [displayString, setDisplayString] = useState(value.toString());

    const handleOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      const originalValue = e.target.value;
      const value = Number.parseFloat(originalValue);

      if (value < 0) return;

      /* Case: max decimal to 6 for USDC */
      if (originalValue.split('.')[1]?.length > 6) return;

      /* Case: Handling value ends with 0, eg: 0.10 */
      if (originalValue.charAt(originalValue.length - 1) === '0') {
        setValue(value);
        setDisplayString(originalValue);
      } else {
        setDisplayString(value.toString());
      }

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
          <label className={`label label-text-alt font-bold ${labelClassName}`}>
            {label}
          </label>
        )}

        <div className={['join', className].join(' ')}>
          <div className={inputContainerClassName ?? ''}>
            <input
              {...props}
              className={[
                'input input-bordered rounded-tl-md rounded-bl-md rounded-tr-none rounded-br-none bg-white text-black',
                inputClassName,
              ].join(' ')}
              type="number"
              placeholder={placeholder}
              ref={ref}
              value={displayString}
              disabled={disabled}
              onChange={handleOnChange}
              onKeyUp={handleKeyUpEvent}
            />
          </div>
          <div className="px-3 border border-gray-300 rounded-tr-md rounded-br-md flex flex-row items-center">
            <p className="text-gray-400">USDC</p>
          </div>
        </div>

        {Boolean(helperText) && <p className="label">{helperText}</p>}
        {Boolean(error) && (
          <p className="label label-text text-red-500 font-semibold">{error}</p>
        )}
      </>
    );
  },
);

export default PriceInput;
