import { useRouter } from 'next/navigation';
import { FC } from 'react';

import PrimaryButton from '@/components/ui/buttons/primary-button';
import { OrderStatus } from '@/enums/order/order-status.constant';
import { useReceiveOrder } from '@/hooks/queries/order/receive-order';
import { IOrderSummaryData } from '@/types/order/order-data.type';
import { NumberDisplayHelper } from '@/utils/shared/display-helper/number-display-helper';

import { OrderStatusBadge } from '../../shared/order-status-badge';

type OrderListItemProps = {
  order: IOrderSummaryData;
};

export const OrderListItem: FC<OrderListItemProps> = ({ order }) => {
  const router = useRouter();
  const { mutateAsync: receiveOrderFn, isPending: isReceiveOrderPending } =
    useReceiveOrder();

  const shouldDisableAllButtons = isReceiveOrderPending;

  const payButtonOnClickHandler = () => {
    router.push(
      `/payment?${new URLSearchParams({
        orderId: order.uuid,
      })}`,
    );
  };

  const receiveOrderButtonOnClickHandler = async () => {
    await receiveOrderFn({
      orderId: order.uuid,
    });
  };

  return (
    <li className="p-4 rounded-box shadow-lg dark:bg-gray-900 flex flex-row justify-between items-center gap-x-3">
      {/* Order Info */}
      <div className="flex flex-col w-full lg:flex-row lg:justify-between">
        <div className="flex-1">{order.product.name}</div>
        <div className="w-14">{order.quantity}</div>
        <div className="w-44">
          {NumberDisplayHelper.convertNumberToDisplayString(
            NumberDisplayHelper.convertMicroUsdcToUsdc(
              order.totalAmountInMicroUsdc,
            ),
          )}
        </div>
        <div className="flex-1">
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      {/* Order Action */}
      <div className="w-[170px] flex justify-end">
        {order.status === OrderStatus.PENDING_PAYMENT && (
          <PrimaryButton
            buttonStyle="contained"
            onClick={payButtonOnClickHandler}
            disabled={shouldDisableAllButtons}
          >
            Pay
          </PrimaryButton>
        )}
        {order.status === OrderStatus.DELIVERY_IN_PROGRESS && (
          <PrimaryButton
            buttonStyle="outlined"
            onClick={receiveOrderButtonOnClickHandler}
            disabled={shouldDisableAllButtons}
          >
            Receive Order
          </PrimaryButton>
        )}
      </div>
    </li>
  );
};
