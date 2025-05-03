'use client';

import { useRouter } from 'next/navigation';
import { FC, useEffect } from 'react';
import toast from 'react-hot-toast';

import PrimaryButton from '@/components/ui/buttons/primary-button';
import Card from '@/components/ui/Card';
import Title from '@/components/ui/typography/title';
import { useGetSellerProductList } from '@/hooks/queries/products/sellers/get-seller-product';
import { NumberDisplayHelper } from '@/utils/shared/display-helper/number-display-helper';
import { ErrorHandler } from '@/utils/shared/error-handler';

const SellerProductDashboard: FC = () => {
  const router = useRouter();

  const { data: sellerProductList, error: getSellerProductListError } =
    useGetSellerProductList();

  const generateProductOnClickHandler = (productId: string) => () => {
    router.replace(`product/${productId}`);
  };

  const addProductButtonOnClickHandler = () => {
    router.push('product/new');
  };

  useEffect(() => {
    if (!getSellerProductListError) return;

    const errorStatus = ErrorHandler.extractStatusCodeFromError(
      getSellerProductListError,
    );
    const errorMessage = ErrorHandler.extractErrorMessage(
      getSellerProductListError,
    );

    switch (errorStatus) {
      case 401:
      case 403:
        router.replace('/seller');
        return;
      default:
        break;
    }

    toast.error(errorMessage);
  }, [getSellerProductListError, router]);

  if (!sellerProductList) {
    return (
      <div>
        <span className="loading loading-spinner" />
      </div>
    );
  }

  if (!sellerProductList.products.length) {
    return (
      <>
        <div className="flex flex-row items-center gap-3 mt-3">
          <Title>Products</Title>
          <PrimaryButton
            buttonStyle="outlined"
            onClick={addProductButtonOnClickHandler}
          >
            Add Product
          </PrimaryButton>
        </div>
        <div className="mt-4">
          <p className="text-lg text-center font-bold">
            No product listed yet.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-row items-center gap-3 mt-3">
        <Title>Products</Title>
        <PrimaryButton
          buttonStyle="outlined"
          onClick={addProductButtonOnClickHandler}
        >
          Add Product
        </PrimaryButton>
      </div>
      <div className="flex flex-row flex-wrap gap-x-5 gap-y-10 justify-center mt-5">
        {sellerProductList.products.map((product) => {
          return (
            <div key={`product-${product.uuid}"`}>
              <Card
                title={product.name}
                price={NumberDisplayHelper.convertLamportToSol(
                  product.priceInLamport,
                )}
                onClickFn={generateProductOnClickHandler(product.uuid)}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SellerProductDashboard;
