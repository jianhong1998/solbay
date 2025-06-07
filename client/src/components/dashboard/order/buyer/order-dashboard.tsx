'use client';

import { FC, useEffect } from 'react';
import toast from 'react-hot-toast';

import FullPageLoading from '@/components/ui/loading/full-page-loading';
import { useGetAllBuyerOrder } from '@/hooks/queries/order/get-order';
import { ErrorHandler } from '@/utils/shared/error-handler';

import { NoOrderDisplay } from './no-order-display/no-order-display';
import { OrderList } from './order-list/order-list';

export const BuyerOrderDashboard: FC = () => {
  const {
    data: orders,
    error: getOrdersError,
    isFetched: isOrderFetched,
  } = useGetAllBuyerOrder();

  useEffect(() => {
    if (getOrdersError) {
      const errorMessage = ErrorHandler.extractErrorMessage(getOrdersError);

      toast.error(errorMessage);
    }
  }, [getOrdersError]);

  if (!isOrderFetched) {
    return <FullPageLoading />;
  }

  if (!orders?.length) {
    return <NoOrderDisplay />;
  }

  return (
    <div className="mt-3">
      <OrderList orders={orders} />
    </div>
  );
};
