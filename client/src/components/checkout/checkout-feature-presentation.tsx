import { FC } from 'react';

import { IProductWithoutSensitiveData } from '@/types/product/product-without-sensitive-data.type';

import CheckoutDeliveryForm from '../form/checkout-delivery-form/checkout-delivery-form';
import { ILogisticInfoFormData } from '../form/checkout-delivery-form/logistic-info-form-data.type';
import LinkButton from '../ui/buttons/link-button';
import PrimaryButton from '../ui/buttons/primary-button';
import Title from '../ui/typography/title';
import CheckoutProductList from './product-list/product-list';

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
}) => {
  return (
    <div className="mb-5">
      <div className="mt-3">
        <Title>Checkout</Title>
      </div>
      <div className="divider" />
      <div>
        <CheckoutProductList
          products={[product]}
          isSubmitting={false}
          productQuantities={productQuantityDictionary}
          setProductQuantities={setProductQuantityDictionary}
        />
      </div>
      <div className="divider" />
      <div>
        <CheckoutDeliveryForm
          formData={logisticFormData}
          setFormData={setLogisticFormData}
        />
      </div>
      <div className="divider" />
      <div className="flex flex-row justify-end gap-x-3">
        <LinkButton onClick={backButtonOnClickHandler}>Back</LinkButton>
        <PrimaryButton
          onClick={checkoutButtonOnClickHandler}
          disabled={!isAllQuantitiesValid || !isAllLogisticInfoDataValid}
        >
          Checkout
        </PrimaryButton>
      </div>
    </div>
  );
};

export default CheckoutFeaturePresentation;
