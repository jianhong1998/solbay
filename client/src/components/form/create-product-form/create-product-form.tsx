'use client';

import { Dispatch, FC, SetStateAction } from 'react';

import PriceInput from '@/components/ui/inputs/price-input';
import TextAreaInput from '@/components/ui/inputs/text-area';
import TextInput from '@/components/ui/inputs/text-input';
import { IProductCreationData } from '@/types/product/product-creation-data.type';
import { NumberDisplayHelper } from '@/utils/shared/display-helper/number-display-helper';

type CreateProductFormProps = {
  productData: IProductCreationData;
  updateProductDataFn: (productData: IProductCreationData) => void;
  isLoading?: boolean;
};

const CreateProductForm: FC<CreateProductFormProps> = ({
  productData,
  updateProductDataFn,
  isLoading,
}) => {
  const nameOnChangeHandler: Dispatch<SetStateAction<string>> = (value) => {
    const updatedName = value.toString();
    updateProductDataFn({
      ...productData,
      name: updatedName,
    });
  };

  const descriptionOnChangeHandler: Dispatch<SetStateAction<string>> = (
    value,
  ) => {
    const updatedName = value.toString();
    updateProductDataFn({
      ...productData,
      description: updatedName,
    });
  };

  const priceOnChangeHandler: Dispatch<SetStateAction<number>> = (value) => {
    const priceInSol = Number.parseFloat(value.toString());
    const priceInLamport = NumberDisplayHelper.convertSolToLamport(priceInSol);

    updateProductDataFn({
      ...productData,
      priceInLamport,
    });
  };

  return (
    <>
      <div>
        {/* Name */}
        <TextInput
          value={productData.name}
          setValue={nameOnChangeHandler}
          label="Product Name"
          className="w-full"
          disabled={isLoading}
        />

        {/* Description */}
        <TextAreaInput
          value={productData.description}
          setValue={descriptionOnChangeHandler}
          label="Product Description"
          className="w-full h-64"
          disabled={isLoading}
        />

        {/* Price */}
        <PriceInput
          value={NumberDisplayHelper.convertLamportToSol(
            productData.priceInLamport,
          )}
          setValue={priceOnChangeHandler}
          label="Unit Price"
          disabled={isLoading}
        />
      </div>
    </>
  );
};

export default CreateProductForm;
