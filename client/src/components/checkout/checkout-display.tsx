import { FC } from 'react';

import { IProductWithoutSensitiveData } from '@/types/product/product-without-sensitive-data.type';

import CheckoutDeliveryForm from '../form/checkout-delivery-form/checkout-delivery-form';
import { ILogisticInfoFormData } from '../form/checkout-delivery-form/logistic-info-form-data.type';
import LinkButton from '../ui/buttons/link-button';
import PrimaryButton from '../ui/buttons/primary-button';
import Title from '../ui/typography/title';
import CheckoutProductList from './product-list/product-list';

type CheckoutDisplayProps = {
  title: string;
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
  primaryButtonText: string;
  primaryButtonOnClickHandler: () => void;
  backButtonOnClickHandler: () => void;
  isPrimaryButtonLoading: boolean;
  isReadOnly?: boolean;
  customActionSection?: React.ReactNode;
};

const CheckoutDisplay: FC<CheckoutDisplayProps> = ({
  title,
  product,
  productQuantityDictionary,
  setProductQuantityDictionary,
  isAllQuantitiesValid,
  logisticFormData,
  setLogisticFormData,
  isAllLogisticInfoDataValid,
  primaryButtonText,
  primaryButtonOnClickHandler,
  backButtonOnClickHandler,
  isPrimaryButtonLoading,
  isReadOnly = false,
  customActionSection,
}) => {
  return (
    <div className="mb-5">
      <div className="mt-3">
        <Title>{title}</Title>
      </div>
      <div className="divider" />
      <div>
        <CheckoutProductList
          products={[product]}
          isSubmitting={isReadOnly}
          productQuantities={productQuantityDictionary}
          setProductQuantities={
            isReadOnly ? () => {} : setProductQuantityDictionary
          }
          hideAvailableQuantity={isReadOnly}
        />
      </div>
      <div className="divider" />
      <div>
        <CheckoutDeliveryForm
          formData={logisticFormData}
          setFormData={isReadOnly ? () => {} : setLogisticFormData}
          disableEdit={isReadOnly}
        />
      </div>
      <div className="divider" />
      {customActionSection || (
        <div className="flex flex-row justify-end gap-x-3">
          <LinkButton onClick={backButtonOnClickHandler}>Back</LinkButton>
          <PrimaryButton
            onClick={primaryButtonOnClickHandler}
            disabled={!isAllQuantitiesValid || !isAllLogisticInfoDataValid}
            loading={isPrimaryButtonLoading}
          >
            {primaryButtonText}
          </PrimaryButton>
        </div>
      )}
    </div>
  );
};

export default CheckoutDisplay;
