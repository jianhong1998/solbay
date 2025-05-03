'use client';

import { useRouter } from 'next/navigation';
import { FC, useEffect } from 'react';
import toast from 'react-hot-toast';

import ProductDetailsDisplay from '@/components/product/product-details-display/product-details-display';
import FullPageLoading from '@/components/ui/loading/full-page-loading';
import { useGetBuyerProductDetails } from '@/hooks/queries/products/buyers/get-product';
import { ErrorHandler } from '@/utils/shared/error-handler';

import ProductNotFound from './product-not-found';

type BuyerProductDetailsDashboardProps = {
  productId: string;
};

const BuyerProductDetailsDashboard: FC<BuyerProductDetailsDashboardProps> = ({
  productId,
}) => {
  const router = useRouter();

  const {
    data: productDetailsData,
    isFetching: isFetchingProductDetails,
    error: getProductDetailsError,
  } = useGetBuyerProductDetails(productId);

  useEffect(() => {
    if (!getProductDetailsError) return;

    const errorMessage = ErrorHandler.extractErrorMessage(
      getProductDetailsError,
    );

    toast.error(errorMessage);
  }, [getProductDetailsError, router]);

  if (!productDetailsData) {
    if (isFetchingProductDetails) {
      return <FullPageLoading />;
    } else {
      return <ProductNotFound />;
    }
  }

  return <ProductDetailsDisplay productDetails={productDetailsData.product} />;
};

export default BuyerProductDetailsDashboard;
