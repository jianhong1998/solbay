import { useRouter } from 'next/navigation';
import { forwardRef } from 'react';

import PrimaryButton from '@/components/ui/buttons/primary-button';

import { ProductButtonProps } from '../types/product-button-prop.type';

const BuyButton = forwardRef<HTMLButtonElement, ProductButtonProps>(
  ({ productId }, ref) => {
    const router = useRouter();

    const handleBuyButtonOnClick = () => {
      router.push(`/checkout?productId=${productId}`);
    };

    return (
      <PrimaryButton
        onClick={handleBuyButtonOnClick}
        ref={ref}
      >
        Buy
      </PrimaryButton>
    );
  },
);

export default BuyButton;
