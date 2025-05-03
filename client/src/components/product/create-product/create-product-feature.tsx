'use client';

import { useRouter } from 'next/navigation';
import { FC, useEffect, useMemo, useState } from 'react';

import CreateProductForm from '@/components/form/create-product-form/create-product-form';
import PrimaryButton from '@/components/ui/buttons/primary-button';
import Title from '@/components/ui/typography/title';
import { useAddProduct } from '@/hooks/queries/products/sellers/add-product';
import { IProductCreationData } from '@/types/product/product-creation-data.type';

const CreateProductFeature: FC = () => {
  const router = useRouter();

  const [productData, setProductData] = useState<IProductCreationData>({
    name: '',
    description: '',
    priceInLamport: 0,
  });
  const isReadyForCreate = useMemo(() => {
    const { description, name, priceInLamport } = productData;

    return (
      Boolean(description.length) && Boolean(name.length) && priceInLamport > 0
    );
  }, [productData]);

  const {
    data: addedProductData,
    isSuccess: isAddProductSuccess,
    isPending: isAddProductPending,
    mutateAsync: addProductFn,
  } = useAddProduct();

  const updateProductData = (productData: IProductCreationData) => {
    setProductData(productData);
  };

  const redirectBackHandler = () => {
    router.push('../product');
  };

  const addProductHandler = async () => {
    const { description, name, priceInLamport } = productData;

    if (!isReadyForCreate) return;

    await addProductFn({
      name,
      description,
      priceInLamport,
      isPublish: true, // TODO: (Enhancement) publish feature
    });
  };

  /* Handle redirection for successully adding product */
  useEffect(() => {
    if (!isAddProductSuccess || !addedProductData) return;

    router.push(`../product/${addedProductData.uuid}`);
  }, [isAddProductSuccess, addedProductData, router]);

  return (
    <div className="mx-auto sm:max-w-md lg:max-w-4xl">
      <Title>Add Product</Title>
      <CreateProductForm
        productData={productData}
        updateProductDataFn={updateProductData}
        isLoading={isAddProductPending}
      />
      <div className="flex flex-row justify-between w-full mt-10">
        <PrimaryButton
          buttonStyle="outlined"
          onClick={redirectBackHandler}
          disabled={isAddProductPending}
        >
          Back
        </PrimaryButton>
        <PrimaryButton
          onClick={addProductHandler}
          disabled={!isReadyForCreate}
          loading={isAddProductPending}
        >
          Create Product
        </PrimaryButton>
      </div>
    </div>
  );
};

export default CreateProductFeature;
