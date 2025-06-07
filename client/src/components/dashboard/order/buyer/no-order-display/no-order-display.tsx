import { FC } from 'react';

import PrimaryButton from '@/components/ui/buttons/primary-button';

export const NoOrderDisplay: FC = () => {
  return (
    <div className="flex flex-col items-center">
      <p>You haven&apos;t purchase anything yet.</p>
      <PrimaryButton>Browse Products</PrimaryButton>
    </div>
  );
};
