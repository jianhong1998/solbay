import { useRouter } from 'next/navigation';
import { FC } from 'react';

import PrimaryButton from '@/components/ui/buttons/primary-button';

export const NoOrderDisplay: FC = () => {
  const router = useRouter();
  const browseProductOnClickHandler = () => {
    router.push('/products');
  };

  return (
    <div className="flex flex-col items-center">
      <p>You haven&apos;t purchase anything yet.</p>
      <PrimaryButton onClick={browseProductOnClickHandler}>
        Browse Products
      </PrimaryButton>
    </div>
  );
};
