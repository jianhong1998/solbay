'use client';

import { useRouter } from 'next/navigation';
import { FC, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';

import { useGetBuyerProductDetails } from '@/hooks/queries/products/buyers/get-product';
import { ErrorHandler } from '@/utils/shared/error-handler';

import ProductNotFound from '../dashboard/buyer/product-details-dashboard/product-not-found';
import FullPageLoading from '../ui/loading/full-page-loading';

type CheckoutFeatureProps = {
  productId: string;
};

const CheckoutFeature: FC<CheckoutFeatureProps> = ({ productId }) => {
  const router = useRouter();
  const productListPagePath = useMemo(() => '/products', []);

  const {
    data: productDetails,
    error: getProductDetailsError,
    isFetched: isGetProductDetailsExecuted,
    isStale: isProductDetailsStale,
    refetch: refetchProductDetailsFn,
  } = useGetBuyerProductDetails(productId);

  useEffect(() => {
    if (!getProductDetailsError) return;

    const errorCode = ErrorHandler.extractStatusCodeFromError(
      getProductDetailsError,
    );
    const errorMessage = ErrorHandler.extractErrorMessage(
      getProductDetailsError,
    );

    switch (errorCode) {
      case 401:
        router.replace(productListPagePath);
      case 404:
        toast.error(errorMessage);
        router.replace(productListPagePath);
      default:
        break;
    }

    toast.error(errorMessage);
  }, [getProductDetailsError, router, productListPagePath]);

  /* Handling stale data refetching */
  useEffect(() => {
    if (isProductDetailsStale) refetchProductDetailsFn();
  }, [isProductDetailsStale, refetchProductDetailsFn]);

  if (!productDetails) {
    if (!isGetProductDetailsExecuted) return <FullPageLoading />;

    return <ProductNotFound />;
  }

  return <div>{productDetails?.product.name}</div>;
};

export default CheckoutFeature;
