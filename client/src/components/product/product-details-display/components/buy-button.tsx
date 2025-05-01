import { FC } from 'react';

import PrimaryButton from '@/components/ui/buttons/primary-button';

import { ProductButtonProps } from '../types/product-button-prop.type';

const BuyButton: FC<ProductButtonProps> = () => {
  return <PrimaryButton>Buy</PrimaryButton>;
};

export default BuyButton;
