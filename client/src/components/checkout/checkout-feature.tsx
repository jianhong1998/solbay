'use client';

import { useRouter } from 'next/navigation';
import { FC, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { useGetBuyerProductDetails } from '@/hooks/queries/products/buyers/get-product';
import { ErrorHandler } from '@/utils/shared/error-handler';

import ProductNotFound from '../dashboard/buyer/product-details-dashboard/product-not-found';
import { ILogisticInfoFormData } from '../form/checkout-delivery-form/logistic-info-form-data.type';
import FullPageLoading from '../ui/loading/full-page-loading';
import CheckoutFeaturePresentation from './checkout-feature-presentation';
import { CheckoutDataValidationHelper } from './helper/data-validation.helper';

type CheckoutFeatureProps = {
  productId: string;
};

const CheckoutFeature: FC<CheckoutFeatureProps> = ({ productId }) => {
  const [productQuantities, setProductQuantities] = useState<
    Record<string, number>
  >({});
  const [logisticInfoFormData, setLogisticInfoFormData] =
    useState<ILogisticInfoFormData>({
      recipientName: '',
      contactNumber: 0,
      countryCode: 0,
      streetLine1: '',
      streetLine2: '',
      streetLine3: '',
      postalCode: 0,
      city: '',
      country: '',
    });

  const router = useRouter();
  const productListPagePath = '/products';
  const isAllQuantitiesValid = useMemo(() => {
    const allQuantities = Object.values(productQuantities);
    return !allQuantities.some((quantity) => quantity <= 0);
  }, [productQuantities]);
  const isAllLogisticInfoDataValid = useMemo(() => {
    return CheckoutDataValidationHelper.validateLogisticInfoFormData(
      logisticInfoFormData,
    );
  }, [logisticInfoFormData]);

  const {
    data: productDetails,
    error: getProductDetailsError,
    isFetched: isGetProductDetailsExecuted,
    isStale: isProductDetailsStale,
    refetch: refetchProductDetailsFn,
  } = useGetBuyerProductDetails(productId);

  const handleQuantityChange = (params: {
    productId: string;
    quantity: number;
  }) => {
    const { productId, quantity } = params;

    if (Number.isNaN(quantity) || quantity < 0) return;

    const newQuantities = {
      ...productQuantities,
    };
    newQuantities[productId] = quantity;

    setProductQuantities(newQuantities);
  };

  const handleRedirectBack = () => {
    router.push(`products/${productId}`);
  };

  const handleCheckout = () => {
    // TODO: Integrate with submit product
    const _reqBodies = Object.entries(productQuantities).map(
      ([productUuid, quantity]) => {
        return {
          productId: productUuid,
          quantity,
          logisticInfo: logisticInfoFormData,
        };
      },
    );
  };

  /* Handling of error message */
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

  /* Handling of updating productQuantities after product details are fetched */
  useEffect(() => {
    if (!productDetails) return;

    if (
      typeof productQuantities[productId] === 'undefined' ||
      productQuantities[productId] === null
    ) {
      setProductQuantities((prev) => ({
        ...prev,
        [productId]: 1,
      }));
    }
  }, [productDetails, productId, productQuantities]);

  if (!productDetails) {
    if (!isGetProductDetailsExecuted) return <FullPageLoading />;

    return <ProductNotFound />;
  }

  return (
    <CheckoutFeaturePresentation
      product={productDetails.product}
      productQuantityDictionary={productQuantities}
      setProductQuantityDictionary={handleQuantityChange}
      isAllQuantitiesValid={isAllQuantitiesValid}
      checkoutButtonOnClickHandler={handleCheckout}
      logisticFormData={logisticInfoFormData}
      setLogisticFormData={setLogisticInfoFormData}
      isAllLogisticInfoDataValid={isAllLogisticInfoDataValid}
      backButtonOnClickHandler={handleRedirectBack}
    />
  );
};

export default CheckoutFeature;
