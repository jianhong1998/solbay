import {
  ChangeEventHandler,
  Dispatch,
  forwardRef,
  HTMLAttributes,
  KeyboardEventHandler,
  SetStateAction,
} from 'react';

type TextInputProps = HTMLAttributes<HTMLInputElement> & {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  label?: string;
  labelClassName?: string;
  disabled?: boolean;
  placeholder?: string;
  helperText?: string;
  error?: string;
  onEnterPressed?: () => void;
};

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
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
      ...props
    },
    ref,
  ) => {
    const handleOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      setValue(e.target.value);
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
          value={value}
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

export default TextInput;
