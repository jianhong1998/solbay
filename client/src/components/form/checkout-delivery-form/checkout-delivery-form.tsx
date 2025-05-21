import { FC } from 'react';

import CheckoutDeliveryFormPresentation from './checkout-delivery-form-presentation';
import { ILogisticInfoFormData } from './logistic-info-form-data.type';

type CheckoutDeliveryFormProps = {
  formData: ILogisticInfoFormData;
  setFormData: (formData: ILogisticInfoFormData) => void;
};

const CheckoutDeliveryForm: FC<CheckoutDeliveryFormProps> = ({
  formData,
  setFormData,
}) => {
  const handleFormDataChange = (
    changedData: Partial<ILogisticInfoFormData>,
  ) => {
    const data: ILogisticInfoFormData = {
      ...formData,
      ...changedData,
    };

    setFormData(data);
  };

  return (
    <CheckoutDeliveryFormPresentation
      formData={formData}
      setFormData={handleFormDataChange}
      disableEdit={false}
    />
  );
};

export default CheckoutDeliveryForm;
