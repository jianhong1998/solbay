'use client';

import { FC, useState } from 'react';

import { IUseSellerShipOutParams } from '@/hooks/queries/order/seller-order/seller-ship-out';

import { UpdateLogisticTrackingInfoFormPresentation } from './update-logistic-tracking-info-form-presentation';

type UpdateLogisticTrackingInfoFormProps = {
  onSubmit: (formData: IFormData) => Promise<void>;
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
> = ({ onSubmit }) => {
  const [formData, _setFormData] = useState(defaultFormData);

  const _handleSubmit = async () => {
    await onSubmit(formData);
  };

  return <UpdateLogisticTrackingInfoFormPresentation />;
};
