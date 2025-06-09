'use client';

import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';

import { IUseSellerShipOutParams } from '@/hooks/queries/order/seller-order/seller-ship-out';

import { UpdateLogisticTrackingInfoFormPresentation } from './update-logistic-tracking-info-form-presentation';

type UpdateLogisticTrackingInfoFormProps = {
  onSubmit: (formData: IFormData) => Promise<void>;
  orderListPageUrl: string;
  isPending: boolean;
};

type IFormData = IUseSellerShipOutParams['logisticTrackingInfo'];

const defaultFormData: IFormData = {
  estimatedDeliverDate: new Date(),
  logisticProvider: '',
  trackingCode: '',
  trackingUrl: null,
};

export const UpdateLogisticTrackingInfoForm: FC<
  UpdateLogisticTrackingInfoFormProps
> = ({ onSubmit, orderListPageUrl, isPending }) => {
  const [formData, setFormData] = useState(defaultFormData);
  const router = useRouter();

  const handleInputChange = (field: keyof IFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    await onSubmit(formData);
  };

  const handleCancel = () => {
    router.push(orderListPageUrl);
  };

  return (
    <UpdateLogisticTrackingInfoFormPresentation
      formData={formData}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isPending={isPending}
    />
  );
};
