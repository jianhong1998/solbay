import { FC, ReactNode } from 'react';

type AppHeroProps = {
  title: ReactNode;
  subtitle: ReactNode;
  children?: ReactNode;
  padding?: number;
};

export const AppHero: FC<AppHeroProps> = ({
  children,
  title,
  subtitle,
  padding,
}) => {
  return (
    <div className={`hero ${padding ? `py-[${padding}px]` : ''}`}>
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          {typeof title === 'string' ? (
            <h1 className="text-5xl font-bold">{title}</h1>
          ) : (
            title
          )}
          {typeof subtitle === 'string' ? (
            <p className="py-6">{subtitle}</p>
          ) : (
            subtitle
          )}
          {children}
        </div>
      </div>
    </div>
  );
};
