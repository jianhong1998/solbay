import { FC } from 'react';

import { IProductWithoutSensitiveData } from '@/types/product/product-without-sensitive-data.type';

import { ILogisticInfoFormData } from '../form/checkout-delivery-form/logistic-info-form-data.type';
import CheckoutDisplay from './checkout-display';

type CheckoutFeaturePresentationProps = {
  product: IProductWithoutSensitiveData;
  productQuantityDictionary: Record<string, number>;
  setProductQuantityDictionary: (params: {
    productId: string;
    quantity: number;
  }) => void;
  isAllQuantitiesValid: boolean;
  logisticFormData: ILogisticInfoFormData;
  setLogisticFormData: (data: ILogisticInfoFormData) => void;
  isAllLogisticInfoDataValid: boolean;
  checkoutButtonOnClickHandler: () => void;
  backButtonOnClickHandler: () => void;
  isCheckoutLoading: boolean;
};

const CheckoutFeaturePresentation: FC<CheckoutFeaturePresentationProps> = ({
  product,
  productQuantityDictionary,
  setProductQuantityDictionary,
  isAllQuantitiesValid,
  logisticFormData,
  setLogisticFormData,
  isAllLogisticInfoDataValid,
  checkoutButtonOnClickHandler,
  backButtonOnClickHandler,
  isCheckoutLoading,
}) => {
  return (
    <CheckoutDisplay
      title="Checkout"
      product={product}
      productQuantityDictionary={productQuantityDictionary}
      setProductQuantityDictionary={setProductQuantityDictionary}
      isAllQuantitiesValid={isAllQuantitiesValid}
      logisticFormData={logisticFormData}
      setLogisticFormData={setLogisticFormData}
      isAllLogisticInfoDataValid={isAllLogisticInfoDataValid}
      primaryButtonText="Checkout"
      primaryButtonOnClickHandler={checkoutButtonOnClickHandler}
      backButtonOnClickHandler={backButtonOnClickHandler}
      isPrimaryButtonLoading={isCheckoutLoading}
      isReadOnly={false}
    />
  );
};

export default CheckoutFeaturePresentation;
