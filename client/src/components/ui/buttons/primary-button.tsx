import { forwardRef } from 'react';

import { ButtonProps } from './button-props';

const PrimaryButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, disabled, loading, buttonStyle, className, ...props }, ref) => {
    const disableClassName = disabled || loading ? 'btn-disabled' : undefined;
    let buttonStyleClassName = '';

    switch (buttonStyle) {
      case 'circle':
        buttonStyleClassName = 'btn-circle';
        break;
      case 'outlined':
        buttonStyleClassName = 'btn-outline';
        break;
      case 'contained':
      default:
        break;
    }

    return (
      <button
        {...props}
        ref={ref}
        className={[
          'btn btn-primary',
          buttonStyleClassName,
          disableClassName,
          className,
        ].join(' ')}
      >
        {children}
        {loading && <span className="loading loading-spinner" />}
      </button>
    );
  },
);

export default PrimaryButton;
