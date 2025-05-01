import { FC } from 'react';

import PrimaryButton from '@/components/ui/buttons/primary-button';

import { ProductButtonProps } from '../types/product-button-prop.type';

const EditButton: FC<ProductButtonProps> = ({ disable }) => {
  return <PrimaryButton disabled={disable}>Edit</PrimaryButton>;
};

export default EditButton;
