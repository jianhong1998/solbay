import { FC } from 'react';

import NumberInput from '@/components/ui/inputs/number-input';
import TextInput from '@/components/ui/inputs/text-input';
import Title from '@/components/ui/typography/title';

import { ILogisticInfoFormData } from './logistic-info-form-data.type';

type CheckoutDeliveryFormPresentationProps = {
  formData: ILogisticInfoFormData;
  setFormData: (value: Partial<ILogisticInfoFormData>) => void;
  disableEdit: boolean;
};

const CheckoutDeliveryFormPresentation: FC<
  CheckoutDeliveryFormPresentationProps
> = ({ formData, setFormData, disableEdit }) => {
  // TODO: Mobile responsive UI

  return (
    <div className="flex flex-col gap-y-5">
      {/* Personal Info */}
      <div>
        <Title className="text-xl">Recipient Info</Title>
        <div className="flex gap-x-3">
          {/* Recipient Name */}
          <div className="flex-1">
            <TextInput
              className="w-full"
              value={formData.recipientName}
              setValue={(value) => {
                setFormData({ recipientName: value });
              }}
              label="Recipient Name"
              disabled={disableEdit}
            />
          </div>
          {/* Country Code for Contact Number */}
          <div>
            <NumberInput
              className="w-full"
              label="Country Code"
              value={formData.countryCode}
              setValue={(value) => setFormData({ countryCode: value })}
              disabled={disableEdit}
              maxDigit={4}
              minValue={0}
              placeholder="Example: +1"
            />
          </div>
          {/* Contact Number */}
          <div>
            <NumberInput
              className="w-full"
              label="Contact Number"
              value={formData.contactNumber}
              setValue={(value) => setFormData({ contactNumber: value })}
              disabled={disableEdit}
              maxDigit={15}
              minValue={0}
            />
          </div>
        </div>
      </div>
      {/* Delivery Info */}
      <div>
        <Title className="text-xl">Delivery Info</Title>
        <div className="">
          {/* Address Line 1 */}
          <TextInput
            label="Address Line 1"
            className="w-full"
            value={formData.streetLine1}
            setValue={(value) => setFormData({ streetLine1: value })}
            disabled={disableEdit}
          />
          {/* Address Line 2 */}
          <TextInput
            label="Address Line 2"
            className="w-full"
            value={formData.streetLine2 ?? ''}
            setValue={(value) => setFormData({ streetLine2: value })}
            placeholder="(Optional)"
            disabled={disableEdit}
          />
          {/* Address Line 3 */}
          <TextInput
            label="Address Line 3"
            className="w-full"
            value={formData.streetLine3 ?? ''}
            setValue={(value) => setFormData({ streetLine3: value })}
            placeholder="(Optional)"
            disabled={disableEdit}
          />
        </div>
        <div className="join join-vertical lg:join-horizontal gap-x-5">
          {/* Postal Code */}
          <div className="join-item">
            <NumberInput
              label="Postal Code"
              className="w-full"
              value={formData.postalCode}
              setValue={(value) => setFormData({ postalCode: value })}
              disabled={disableEdit}
              maxDigit={10}
              minValue={0}
            />
          </div>
          {/* City */}
          <div className="join-item">
            <TextInput
              label="City"
              className="w-full"
              value={formData.city}
              setValue={(value) => setFormData({ city: value })}
              disabled={disableEdit}
            />
          </div>
          <div className="join-item">
            {/* Country */}
            <TextInput
              className="w-full"
              label="Country"
              value={formData.country}
              setValue={(value) => setFormData({ country: value })}
              disabled={disableEdit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutDeliveryFormPresentation;
