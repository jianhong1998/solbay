import {
  ChangeEventHandler,
  Dispatch,
  forwardRef,
  HTMLAttributes,
  SetStateAction,
} from 'react';

type TextAreaInputProps = HTMLAttributes<HTMLTextAreaElement> & {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  label?: string;
  labelClassName?: string;
  disabled?: boolean;
  placeholder?: string;
  helperText?: string;
  error?: string;
};

const TextAreaInput = forwardRef<HTMLTextAreaElement, TextAreaInputProps>(
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
      ...props
    },
    ref,
  ) => {
    const handleOnChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
      setValue(e.target.value);
    };

    return (
      <>
        {Boolean(label) && (
          <label className={`label label-text font-bold ${labelClassName}`}>
            {label}
          </label>
        )}
        <textarea
          {...props}
          className={[
            'textarea textarea-bordered textarea-md rounded-md bg-white text-black',
            className,
          ].join(' ')}
          placeholder={placeholder}
          ref={ref}
          value={value}
          disabled={disabled}
          onChange={handleOnChange}
        />
        {Boolean(helperText) && <p className="label">{helperText}</p>}
        {Boolean(error) && (
          <p className="label label-text text-red-500 font-semibold">{error}</p>
        )}
      </>
    );
  },
);

export default TextAreaInput;
