'use client';

import { useRouter } from 'next/navigation';
import { FC, useEffect } from 'react';
import toast from 'react-hot-toast';

import FullPageLoading from '@/components/ui/loading/full-page-loading';
import Title from '@/components/ui/typography/title';
import { useGetAllSellerOrders } from '@/hooks/queries/order/get-order';
import { useGetSeller } from '@/hooks/queries/seller/get-seller/get-seller';
import { ErrorHandler } from '@/utils/shared/error-handler';

import { NoOrderDisplay } from './no-order-display/no-order-display';
import { OrderList } from './order-list/order-list';

export const SellerOrderDashboard: FC = () => {
  const router = useRouter();

  const {
    data: orders,
    isFetched: isOrdersFetched,
    error: getOrdersError,
  } = useGetAllSellerOrders();
  const {
    data: sellerData,
    isFetched: isSellerDataFetched,
    error: getSellerDataError,
  } = useGetSeller();

  /* Handle Error Message */
  useEffect(() => {
    if (!getSellerDataError && !getOrdersError) return;

    let message = '';

    if (getSellerDataError)
      message = ErrorHandler.extractErrorMessage(getSellerDataError);
    if (getOrdersError)
      message = ErrorHandler.extractErrorMessage(getOrdersError);

    toast.error(message);
  }, [getSellerDataError, getOrdersError]);

  if (!isOrdersFetched || !isSellerDataFetched) return <FullPageLoading />;
  if (!orders || !orders.length) return <NoOrderDisplay />;
  if (!sellerData) {
    router.replace('/seller');
    return;
  }

  return (
    <div className="mx-auto sm:max-w-md lg:max-w-4xl">
      <Title className="mt-4">My Orders</Title>
      <div className="mt-4">
        <OrderList
          orders={orders}
          sellerId={sellerData.uuid}
        />
      </div>
    </div>
  );
};
