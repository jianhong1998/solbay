import { FC, FormEventHandler, MouseEventHandler } from 'react';

import DangerButton from '@/components/ui/buttons/danger-button';
import PrimaryButton from '@/components/ui/buttons/primary-button';
import PriceInput from '@/components/ui/inputs/price-input';
import Title from '@/components/ui/typography/title';

type IValues = {
  withdrawAmount: number;
};

type AdminWithdrawProfitFormPresentationProps = {
  values: IValues;
  setValues: (values: IValues) => void;
  maxWithdrawAmount: number;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onCancel: () => void;
  isPending: boolean;
};

export const AdminWithdrawProfitFormPresentation: FC<
  AdminWithdrawProfitFormPresentationProps
> = ({
  onSubmit,
  onCancel,
  values,
  setValues,
  maxWithdrawAmount,
  isPending,
}) => {
  const handleWithdrawAmountChange = (amount: number) => {
    if (maxWithdrawAmount < amount) return;

    const newValues: IValues = {
      ...values,
      withdrawAmount: amount,
    };

    setValues(newValues);
  };

  const handleCancelButtonOnClick: MouseEventHandler<HTMLButtonElement> = (
    event,
  ) => {
    event.preventDefault();
    onCancel();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full"
    >
      {/* Form Title */}
      <div className="mb-3">
        <Title>Withdraw Profit</Title>
      </div>
      {/* Form Body */}
      <div className="mb-4">
        <PriceInput
          value={values.withdrawAmount}
          setValue={handleWithdrawAmountChange}
          className="w-full"
          inputClassName="w-full"
          inputContainerClassName="w-full"
          disabled={isPending}
        />
      </div>
      {/* Form Action */}
      <div className="flex flex-row justify-between gap-x-3">
        <PrimaryButton
          buttonStyle="outlined"
          onClick={handleCancelButtonOnClick}
          className="flex-1"
          disabled={isPending}
        >
          Cancel
        </PrimaryButton>
        <DangerButton
          buttonStyle="contained"
          className="flex-1"
          loading={isPending}
          disabled={values.withdrawAmount === 0}
        >
          Withdraw
        </DangerButton>
      </div>
    </form>
  );
};
