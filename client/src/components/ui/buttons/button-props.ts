import { HTMLAttributes } from 'react';

export type ButtonProps = HTMLAttributes<HTMLButtonElement> & {
  disabled?: boolean;
  loading?: boolean;
  buttonStyle?: 'outlined' | 'contained' | 'circle';
};
