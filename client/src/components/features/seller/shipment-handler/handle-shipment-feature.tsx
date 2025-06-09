'use client';

import { useRouter } from 'next/navigation';
import { FC, useCallback, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';

import { UpdateLogisticTrackingInfoForm } from '@/components/form/seller-update-logistic-tracking-info-form/update-logistic-tracking-info-form';
import FullPageLoading from '@/components/ui/loading/full-page-loading';
import { OrderStatus } from '@/enums/order/order-status.constant';
import { useGetOrderDetails } from '@/hooks/queries/order/get-order';
import {
  IUseSellerShipOutParams,
  useSellerShipOut,
} from '@/hooks/queries/order/seller-order/seller-ship-out';
import { ErrorHandler } from '@/utils/shared/error-handler';

type HandleShipmentFeatureProps = {
  orderId: string;
  sellerId: string;
};

export const HandleShipmentFeature: FC<HandleShipmentFeatureProps> = ({
  orderId,
  sellerId,
}) => {
  const router = useRouter();
  const sellerOrderPageUrl = useMemo(
    () => `/seller/${sellerId}/order`,
    [sellerId],
  );

  const {
    data: orderDetails,
    isFetched: isOrderDetailsFetched,
    error: getOrderDetailsError,
  } = useGetOrderDetails(orderId);

  const { mutateAsync: submitShipOutFn, isPending: isShipOutPending } =
    useSellerShipOut();

  const submitAction = useCallback(
    async (
      logisticTrackingInfo: IUseSellerShipOutParams['logisticTrackingInfo'],
    ) => {
      await submitShipOutFn({
        orderId,
        logisticTrackingInfo,
      });
    },
    [submitShipOutFn, orderId],
  );

  /* Error handler */
  useEffect(() => {
    if (!getOrderDetailsError) return;

    const errorMessage = ErrorHandler.extractErrorMessage(getOrderDetailsError);
    toast.error(errorMessage);
  }, [getOrderDetailsError]);

  /* Handle redirect to seller order page if:
    - seller no permission to update status
    - order is not pending-seller-ship-out
  */
  useEffect(() => {
    if (!orderDetails) return;

    if (orderDetails.product.seller.id !== sellerId) {
      toast.error('You do not have permission to update this order status.');
      router.push(sellerOrderPageUrl);
      return;
    }

    if (orderDetails.status !== OrderStatus.PENDING_SELLER_SHIP_OUT) {
      toast.error(`Order is not pending ship out.`);
      router.push(sellerOrderPageUrl);
      return;
    }
  }, [orderDetails, sellerId, router, sellerOrderPageUrl]);

  if (!isOrderDetailsFetched) return <FullPageLoading />;

  return (
    <UpdateLogisticTrackingInfoForm
      onSubmit={submitAction}
      isPending={isShipOutPending}
      orderListPageUrl={sellerOrderPageUrl}
    />
  );
};
