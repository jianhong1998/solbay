import { FC } from 'react';

import { IProductWithoutSensitiveData } from '@/types/product/product-without-sensitive-data.type';

import CheckoutDisplay from '../../checkout/checkout-display';
import { ILogisticInfoFormData } from '../../form/checkout-delivery-form/logistic-info-form-data.type';
import LinkButton from '../../ui/buttons/link-button';
import PrimaryButton from '../../ui/buttons/primary-button';

type PaymentFeaturePresentationProps = {
  product: IProductWithoutSensitiveData;
  productQuantityDictionary: Record<string, number>;
  logisticFormData: ILogisticInfoFormData;
  backButtonOnClickHandler: () => void;
  paymentButtonOnClickHandler: () => void;
  isPaymentLoading: boolean;
};

const PaymentFeaturePresentation: FC<PaymentFeaturePresentationProps> = ({
  product,
  productQuantityDictionary,
  logisticFormData,
  backButtonOnClickHandler,
  paymentButtonOnClickHandler,
  isPaymentLoading,
}) => {
  const customActionSection = (
    <div className="flex flex-row justify-end gap-x-3">
      <LinkButton onClick={backButtonOnClickHandler}>Back</LinkButton>
      <PrimaryButton
        onClick={paymentButtonOnClickHandler}
        loading={isPaymentLoading}
      >
        Proceed to Payment
      </PrimaryButton>
    </div>
  );

  return (
    <CheckoutDisplay
      title="Payment Confirmation"
      product={product}
      productQuantityDictionary={productQuantityDictionary}
      setProductQuantityDictionary={() => {}} // Read-only: no-op function
      isAllQuantitiesValid={true} // Always valid in read-only mode
      logisticFormData={logisticFormData}
      setLogisticFormData={() => {}} // Read-only: no-op function
      isAllLogisticInfoDataValid={true} // Always valid in read-only mode
      primaryButtonText="" // Not used with custom action section
      primaryButtonOnClickHandler={() => {}} // Not used with custom action section
      backButtonOnClickHandler={backButtonOnClickHandler}
      isPrimaryButtonLoading={false} // Not used with custom action section
      isReadOnly={true}
      customActionSection={customActionSection}
    />
  );
};

export default PaymentFeaturePresentation;
