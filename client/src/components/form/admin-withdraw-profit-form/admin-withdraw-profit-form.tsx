'use client';

import { FC, FormEventHandler, useState } from 'react';

import { useWithdrawProfit } from '@/hooks/queries/admin/withdraw-profit';

import { AdminWithdrawProfitFormPresentation } from './admin-withdraw-profit-form-presentation';

type AdminWithdrawProfitFormProps = {
  escrowOperationAccountPublicKey: string;
  maxAvailableProfit: number;
  cancelFn: () => void;
};

export const AdminWithdrawProfitForm: FC<AdminWithdrawProfitFormProps> = ({
  escrowOperationAccountPublicKey,
  maxAvailableProfit,
  cancelFn,
}) => {
  const [values, setValues] = useState({
    withdrawAmount: maxAvailableProfit,
  });

  const { mutateAsync: withdrawFn, isPending: isWithdrawProfitPending } =
    useWithdrawProfit(escrowOperationAccountPublicKey);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    await withdrawFn({
      amount: values.withdrawAmount,
    });
  };

  return (
    <AdminWithdrawProfitFormPresentation
      maxWithdrawAmount={maxAvailableProfit}
      values={values}
      setValues={setValues}
      onCancel={cancelFn}
      onSubmit={onSubmit}
      isPending={isWithdrawProfitPending}
    />
  );
};
