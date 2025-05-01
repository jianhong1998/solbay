import { forwardRef } from 'react';

import { ButtonProps } from './button-props';

type LinkButtonProps = Omit<ButtonProps, 'buttonStyle'>;

const LinkButton = forwardRef<HTMLButtonElement, LinkButtonProps>(
  ({ children, disabled, loading, className, ...props }, ref) => {
    const disableClassName = disabled || loading ? 'btn-disabled' : undefined;

    return (
      <button
        {...props}
        ref={ref}
        className={['btn btn-link', disableClassName, className].join(' ')}
      >
        {children}
        {loading && <span className="loading loading-spinner" />}
      </button>
    );
  },
);

export default LinkButton;
