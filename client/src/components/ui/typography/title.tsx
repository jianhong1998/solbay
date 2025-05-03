import { forwardRef, HTMLAttributes } from 'react';

type TitleProps = HTMLAttributes<HTMLHeadingElement>;

const Title = forwardRef<HTMLHeadingElement, TitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h1
        {...props}
        className={`font-extrabold text-3xl ${className ?? ''}`}
        ref={ref}
      >
        {children}
      </h1>
    );
  },
);

export default Title;
