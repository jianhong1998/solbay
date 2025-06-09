'use client';

import { FC, useMemo } from 'react';

import LinkButton from '@/components/ui/buttons/link-button';
import PrimaryButton from '@/components/ui/buttons/primary-button';
import TextInput from '@/components/ui/inputs/text-input';
import Title from '@/components/ui/typography/title';
import { IUseSellerShipOutParams } from '@/hooks/queries/order/seller-order/seller-ship-out';

type IFormData = IUseSellerShipOutParams['logisticTrackingInfo'];

interface FormPresentationProps {
  formData: IFormData;
  onInputChange: (field: keyof IFormData, value: any) => void;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  isPending: boolean;
}

export const UpdateLogisticTrackingInfoFormPresentation: FC<
  FormPresentationProps
> = ({ formData, onInputChange, onSubmit, onCancel, isPending }) => {
  const isFormValid = useMemo(() => {
    return (
      formData.logisticProvider.length > 0 &&
      formData.trackingCode.length > 0 &&
      formData.estimatedDeliverDate.toISOString().split('T')[0]
    );
  }, [formData]);

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="mb-4">
        <Title>Ship Order</Title>
      </div>
      <form
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-4"
      >
        <div className="flex flex-col gap-2">
          <label
            htmlFor="estimatedDeliverDate"
            className="label label-text font-bold"
          >
            Estimated Delivery Date
          </label>
          <input
            id="estimatedDeliverDate"
            type="date"
            className="input input-bordered rounded-md bg-white text-black w-full"
            value={formData.estimatedDeliverDate.toISOString().split('T')[0]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onInputChange('estimatedDeliverDate', new Date(e.target.value))
            }
            required
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
          <LinkButton onClick={onCancel}>Cancel</LinkButton>
          <PrimaryButton
            onClick={onSubmit}
            loading={isPending}
            disabled={isPending || !isFormValid}
          >
            Ship Out
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};
