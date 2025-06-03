'use client';

import { FC, useEffect } from 'react';
import toast from 'react-hot-toast';

import { GeneralErrorMessage } from '@/constants/error.constant';
import { useMakePayment } from '@/hooks/queries/payment/make-payment';
import { useUpdatePaymentInfo } from '@/hooks/queries/payment/update-payment-info';
import { ErrorHandler } from '@/utils/shared/error-handler';

type PaymentFeatureProps = {
  orderIds: string[];
};

export const PaymentFeature: FC<PaymentFeatureProps> = ({ orderIds }) => {
  const { isSuccess: isMakePaymentSuccess, error: makePaymentError } =
    useMakePayment(orderIds);
  const {
    mutateAsync: updatePaymentInfoFn,
    isPending: isUpdatePaymentInfoPending,
    isSuccess: isUpdatePaymentInfoSuccess,
  } = useUpdatePaymentInfo();

  useEffect(() => {
    if (
      !isMakePaymentSuccess ||
      isUpdatePaymentInfoPending ||
      isUpdatePaymentInfoSuccess
    )
      return;

    toast.success('Successfully make payment');
    updatePaymentInfoFn({ orderIds });
  }, [
    isMakePaymentSuccess,
    isUpdatePaymentInfoPending,
    isUpdatePaymentInfoSuccess,
    updatePaymentInfoFn,
    orderIds,
  ]);

  useEffect(() => {
    if (!makePaymentError) return;

    const errorStatus =
      ErrorHandler.extractStatusCodeFromError(makePaymentError);
    const errorMessage = ErrorHandler.extractErrorMessage(makePaymentError);

    if (errorStatus === 'ERR_NETWORK') {
      toast.error(GeneralErrorMessage.NETWORK_ERROR);
      return;
    }

    toast.error(errorMessage);
  }, [makePaymentError]);

  return (
    <div>
      <p>Making payment for order:</p>
      <ul>
        {orderIds.map((id) => (
          <li key={id}>{id}</li>
        ))}
      </ul>
    </div>
  );
};
