'use client';

import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';

import CreateProductForm from '@/components/form/create-product-form/create-product-form';
import PrimaryButton from '@/components/ui/buttons/primary-button';
import Title from '@/components/ui/typography/title';
import { IProductCreationData } from '@/types/product/product-creation-data.type';

const CreateProductFeature: FC = () => {
  const router = useRouter();

  const [productData, setProductData] = useState<IProductCreationData>({
    name: '',
    description: '',
    priceInLamport: 0,
  });

  const updateProductData = (productData: IProductCreationData) => {
    setProductData(productData);
  };

  const redirectBackHandler = () => {
    router.push('../product');
  };

  const addProductHandler = async () => {
    // TODO: Create Add Product Endpoint
  };

  return (
    <div className="mx-auto sm:max-w-md lg:max-w-4xl">
      <Title>Add Product</Title>
      <CreateProductForm
        productData={productData}
        updateProductDataFn={updateProductData}
      />
      <div className="flex flex-row justify-between w-full mt-10">
        <PrimaryButton
          buttonStyle="outlined"
          onClick={redirectBackHandler}
        >
          Back
        </PrimaryButton>
        <PrimaryButton onClick={addProductHandler}>
          Create Product
        </PrimaryButton>
      </div>
    </div>
  );
};

export default CreateProductFeature;
