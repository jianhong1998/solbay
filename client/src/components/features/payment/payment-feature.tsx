'use client';

import { useRouter } from 'next/navigation';
import { FC, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';

import { GeneralErrorMessage } from '@/constants/error.constant';
import { useGetOrderDetails } from '@/hooks/queries/order/get-order';
import { useGetOrderLogisticInfo } from '@/hooks/queries/order/get-order-logistic-info';
import { useMakePayment } from '@/hooks/queries/payment/make-payment';
import { useUpdatePaymentInfo } from '@/hooks/queries/payment/update-payment-info';
import { ErrorHandler } from '@/utils/shared/error-handler';

import { ILogisticInfoFormData } from '../../form/checkout-delivery-form/logistic-info-form-data.type';
import FullPageLoading from '../../ui/loading/full-page-loading';
import PaymentFeaturePresentation from './payment-feature-presentation';

type PaymentFeatureProps = {
  orderIds: string[];
};

export const PaymentFeature: FC<PaymentFeatureProps> = ({ orderIds }) => {
  const router = useRouter();

  const { isSuccess: isMakePaymentSuccess, error: makePaymentError } =
    useMakePayment(orderIds);
  const {
    mutateAsync: updatePaymentInfoFn,
    isPending: isUpdatePaymentInfoPending,
    isSuccess: isUpdatePaymentInfoSuccess,
  } = useUpdatePaymentInfo();

  // Fetch order details for the first order to display checkout info
  const {
    data: orderDetails,
    isLoading: isOrderDetailsLoading,
    error: orderDetailsError,
  } = useGetOrderDetails(orderIds[0] || '');

  // Fetch logistic information for the first order
  const {
    data: logisticInfo,
    isLoading: isLogisticInfoLoading,
    error: logisticInfoError,
  } = useGetOrderLogisticInfo(orderIds[0] || '');

  // Prepare data for presentation component
  const presentationData = useMemo(() => {
    if (!orderDetails || !logisticInfo) return null;

    const productQuantities: Record<string, number> = {
      [orderDetails.product.uuid]: orderDetails.quantity,
    };

    // Transform logistic info to match form data structure
    const logisticFormData: ILogisticInfoFormData = {
      recipientName: logisticInfo.recipientName,
      contactNumber: logisticInfo.contactNumber,
      countryCode: logisticInfo.countryCode,
      streetLine1: logisticInfo.streetLine1,
      streetLine2: logisticInfo.streetLine2 || '',
      streetLine3: logisticInfo.streetLine3 || '',
      postalCode: logisticInfo.postalCode,
      city: logisticInfo.city,
      country: logisticInfo.country,
    };

    return {
      product: orderDetails.product,
      productQuantities,
      logisticInfo: logisticFormData,
    };
  }, [orderDetails, logisticInfo]);

  /* Handle update payment info after payment done */
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

  /* Handle make payment error message */
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

  /* Handle redirection after payment updated */
  useEffect(() => {
    if (!isUpdatePaymentInfoSuccess) return;

    router.push('/order');
  }, [isUpdatePaymentInfoSuccess, router]);

  // Show loading while fetching data
  if (isOrderDetailsLoading || isLogisticInfoLoading) {
    return <FullPageLoading />;
  }

  // Show error if data couldn't be fetched
  if (orderDetailsError || logisticInfoError || !presentationData) {
    return (
      <div className="mb-5">
        <div className="mt-3">
          <h1 className="text-2xl font-bold">Payment</h1>
        </div>
        <div className="divider" />
        <div className="text-center py-8">
          <p className="text-red-500">Unable to load order details</p>
          <p className="text-sm text-gray-500 mt-2">
            Order IDs: {orderIds.join(', ')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <PaymentFeaturePresentation
      product={presentationData.product}
      productQuantityDictionary={presentationData.productQuantities}
      logisticFormData={presentationData.logisticInfo}
      backButtonOnClickHandler={() => router.push('/order')}
      paymentButtonOnClickHandler={() => {}} // Payment logic is handled by useMakePayment hook
      isPaymentLoading={false} // This will be updated when we trigger payment manually
    />
  );
};
