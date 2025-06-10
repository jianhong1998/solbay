'use client';

import { FC, MouseEventHandler, useMemo } from 'react';

import LinkButton from '@/components/ui/buttons/link-button';
import PrimaryButton from '@/components/ui/buttons/primary-button';
import DatePicker from '@/components/ui/inputs/date-picker';
import TextInput from '@/components/ui/inputs/text-input';
import Title from '@/components/ui/typography/title';
import { IUseSellerShipOutParams } from '@/hooks/queries/order/seller-order/seller-ship-out';

type IFormData = IUseSellerShipOutParams['logisticTrackingInfo'];

interface ShipOrderFormPresentationProps {
  formData: IFormData;
  onInputChange: (field: keyof IFormData, value: any) => void;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  isPending: boolean;
}

export const ShipOrderFormPresentation: FC<ShipOrderFormPresentationProps> = ({
  formData,
  onInputChange,
  onSubmit,
  onCancel,
  isPending,
}) => {
  const isFormValid = useMemo(() => {
    return (
      formData.logisticProvider.length > 0 &&
      formData.trackingCode.length > 0 &&
      formData.estimatedDeliverDate.toISOString().split('T')[0]
    );
  }, [formData]);

  const cancelButtonOnClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    onCancel();
  };

  const submitButtonOnClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="mb-4">
        <Title>Ship Order</Title>
      </div>
      <form className="space-y-4">
        <div className="flex flex-col gap-2">
          <DatePicker
            id="estimatedDeliverDate"
            value={formData.estimatedDeliverDate}
            setValue={(value: Date) =>
              onInputChange('estimatedDeliverDate', value)
            }
            label="Estimated Delivery Date"
            className="w-full"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className="flex flex-col gap-2">
          <TextInput
            id="logisticProvider"
            value={formData.logisticProvider}
            setValue={(value: string) =>
              onInputChange('logisticProvider', value)
            }
            label="Logistic Provider"
            placeholder="e.g., DHL, FedEx"
            className="w-full"
          />
        </div>
        <div className="flex flex-col gap-2">
          <TextInput
            id="trackingCode"
            value={formData.trackingCode}
            setValue={(value: string) => onInputChange('trackingCode', value)}
            label="Tracking Code"
            placeholder="Tracking number"
            className="w-full"
          />
        </div>
        <div className="flex flex-col gap-2">
          <TextInput
            id="trackingUrl"
            value={formData.trackingUrl || ''}
            setValue={(value: string) =>
              onInputChange('trackingUrl', value || null)
            }
            label="Tracking URL (Optional)"
            placeholder="https://tracking.example.com"
            className="w-full"
          />
        </div>
        <div className="flex flex-row gap-2 justify-end mt-4">
          <LinkButton onClick={cancelButtonOnClick}>Cancel</LinkButton>
          <PrimaryButton
            loading={isPending}
            disabled={isPending || !isFormValid}
            onClick={submitButtonOnClick}
          >
            Ship Out
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};
