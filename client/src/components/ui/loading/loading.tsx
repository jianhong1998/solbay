import { FC } from 'react';

type LoadingProps = {
  loadingStyle?: 'dots' | 'spinner' | 'ring' | 'ball' | 'bars';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
};

const Loading: FC<LoadingProps> = ({
  loadingStyle = 'spinner',
  size = 'sm',
  className,
}) => {
  const loadingStyleClassName = `loading-${loadingStyle}`;
  const loadingSizeClassName = `loading-${size}`;

  return (
    <div>
      <span
        className={`loading ${loadingStyleClassName} ${loadingSizeClassName} ${className}`}
      ></span>
    </div>
  );
};

export default Loading;
