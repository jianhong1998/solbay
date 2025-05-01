'use client';

import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import ProductDetailsDisplay from '@/components/product/product-details-display/product-details-display';
import PrimaryButton from '@/components/ui/buttons/primary-button';
import Loading from '@/components/ui/loading/loading';
import { useGetSellerProductDetails } from '@/hooks/queries/products/sellers/get-seller-product';
import { ErrorHandler } from '@/utils/shared/error-handler';

type SellerProductDetailsDashboardProps = {
  productId: string;
  sellerId: string;
};

const SellerProductDetailsDashboard: FC<SellerProductDetailsDashboardProps> = ({
  productId,
  sellerId,
}) => {
  const [isForbidden, setIsForbidden] = useState<boolean>(false);

  const router = useRouter();

  const {
    data: productDetailsData,
    isFetching: isFetchingProductDetails,
    error: getProductDetailsError,
  } = useGetSellerProductDetails(productId);

  const handleRedirectToProductListPage = () => {
    router.replace(`/seller/${sellerId}/product`);
  };

  useEffect(() => {
    if (!getProductDetailsError) return;

    const statusCode = ErrorHandler.extractStatusCodeFromError(
      getProductDetailsError,
    );
    const errorMessage = ErrorHandler.extractErrorMessage(
      getProductDetailsError,
    );

    switch (statusCode) {
      case 403:
        setIsForbidden(true);
        return;
      default:
        break;
    }

    toast.error(errorMessage);
  }, [getProductDetailsError, router]);

  if (isFetchingProductDetails) {
    return <Loading loadingStyle="spinner" />;
  }

  if (isForbidden) {
    return (
      <div className="flex flex-col mt-3 gap-3 justify-center">
        <p className="text-error text-center">
          You do not have permission to view this product as a seller
        </p>
        <div className="mx-auto">
          <PrimaryButton onClick={handleRedirectToProductListPage}>
            Go Back Product Page
          </PrimaryButton>
        </div>
      </div>
    );
  }

  if (!productDetailsData) return <></>;

  return (
    <ProductDetailsDisplay
      productDetails={productDetailsData.product}
      sellerId={sellerId}
      sellerMode
    />
  );
};

export default SellerProductDetailsDashboard;
