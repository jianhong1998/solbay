'use client';

import { useRouter } from 'next/navigation';
import { FC, useEffect } from 'react';
import toast from 'react-hot-toast';

import { OrderStatusBadge } from '@/components/ui/badges/order-status-badge';
import LinkButton from '@/components/ui/buttons/link-button';
import PrimaryButton from '@/components/ui/buttons/primary-button';
import FullPageLoading from '@/components/ui/loading/full-page-loading';
import { OrderStatus } from '@/enums/order/order-status.constant';
import { useGetOrderDetails } from '@/hooks/queries/order/get-order';
import { useGetOrderLogisticInfo } from '@/hooks/queries/order/get-order-logistic-info';
import { NumberDisplayHelper } from '@/utils/shared/display-helper/number-display-helper';
import { ErrorHandler } from '@/utils/shared/error-handler';

type OrderDetailsFeatureProps = {
  orderId: string;
  sellerId: string;
};

export const OrderDetailsFeature: FC<OrderDetailsFeatureProps> = ({
  orderId,
  sellerId,
}) => {
  const router = useRouter();

  const {
    data: orderDetails,
    error: getOrderDetailsError,
    isFetched: isOrderDetailsFetched,
  } = useGetOrderDetails(orderId);
  const {
    data: orderLogisticInfo,
    error: getOrderLogisticInfoError,
    isFetched: isOrderLogisticInfoFetched,
  } = useGetOrderLogisticInfo(orderId);

  const handleBackToOrderListPage = () => {
    router.push(`/seller/${sellerId}/order`);
  };

  const handleShipOutButtonClick = () => {
    router.push(`/seller/${sellerId}/order/${orderId}/ship-out`);
  };

  /* Handle Errors */
  useEffect(() => {
    if (!getOrderDetailsError && !getOrderLogisticInfoError) return;

    let errorMessage: string = '';

    if (getOrderDetailsError)
      errorMessage = ErrorHandler.extractErrorMessage(getOrderDetailsError);

    if (getOrderLogisticInfoError)
      errorMessage = ErrorHandler.extractErrorMessage(
        getOrderLogisticInfoError,
      );

    toast.error(errorMessage);
  }, [getOrderDetailsError, getOrderLogisticInfoError]);

  if (!isOrderDetailsFetched || !isOrderLogisticInfoFetched)
    return <FullPageLoading />;

  if (!orderDetails) {
    router.push(`/seller/${sellerId}/order`);
    return <></>;
  }

  return (
    <div className="mx-auto sm:max-w-md lg:max-w-4xl">
      <div>
        <LinkButton onClick={handleBackToOrderListPage}>Back</LinkButton>
      </div>

      {/* Card */}
      <div className="shadow-xl rounded-3xl dark:bg-gray-900">
        <figure className="w-full h-72">
          <img
            src="https://placehold.co/600x400"
            alt={`Product image for ${orderDetails.product.name}`}
            className="w-full h-full object-cover rounded-t-3xl"
          />
        </figure>

        <div className="flex flex-col gap-3 px-5 pt-5 pb-7">
          <div>
            <OrderStatusBadge
              status={orderDetails.status}
              sellerMode
            />
            {/* Product Name */}
            <p className="text-2xl text-wrap font-bold dark:text-gray-300">
              {orderDetails.product.name}
            </p>
            {/* Order Quantity */}
            <p className="text-wrap text-gray-400">
              Quantity: {orderDetails.quantity}
            </p>
          </div>

          {/* Order Amount */}
          <div>
            Buyer Paid:{' '}
            {NumberDisplayHelper.convertNumberToDisplayString(
              NumberDisplayHelper.convertMicroUsdcToUsdc(
                orderDetails.totalAmountInMicroUsdc,
              ),
            )}{' '}
            USDC
          </div>

          <div className="divider">
            <p className="text-gray-400">Logistic Information</p>
          </div>

          {/* Logistic Info */}
          <div className="flex flex-col gap-2">
            <div>
              <p className="font-bold">Recipient Name</p>
              <p>{orderLogisticInfo?.recipientName ?? '-'}</p>
            </div>
            <div>
              <p className="font-bold">Contact Number</p>
              <p>
                {orderLogisticInfo?.contactNumber
                  ? `+${orderLogisticInfo.countryCode} ${orderLogisticInfo.contactNumber}`
                  : '-'}
              </p>
            </div>

            {/* Address */}
            <div>
              <p className="font-bold">Address</p>
              {orderLogisticInfo && (
                <>
                  {/* Address - Street Line 1 */}
                  <p className="overflow-x-scroll">
                    {orderLogisticInfo.streetLine1}
                  </p>
                  {/* Address - Street Line 2 */}
                  {orderLogisticInfo.streetLine2 && (
                    <p>{orderLogisticInfo.streetLine2}</p>
                  )}
                  {/* Address - Street Line 3 */}
                  {orderLogisticInfo.streetLine3 && (
                    <p>{orderLogisticInfo.streetLine3}</p>
                  )}
                  {/* Address - Postal Code */}
                  <p>{orderLogisticInfo.postalCode}</p>
                  {/* Address - City */}
                  <p>{orderLogisticInfo.city}</p>
                  {/* Address - Country */}
                  <p>{orderLogisticInfo.country}</p>
                </>
              )}
              {!orderLogisticInfo && <p>-</p>}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end gap-x-3 mt-4">
            {/* TODO: Enhancement for cancel order */}
            {/* <DangerButton buttonStyle="outlined">Cancel Order</DangerButton> */}
            {orderDetails.status === OrderStatus.PENDING_SELLER_SHIP_OUT && (
              <PrimaryButton
                buttonStyle="contained"
                onClick={handleShipOutButtonClick}
              >
                Ship Out
              </PrimaryButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
