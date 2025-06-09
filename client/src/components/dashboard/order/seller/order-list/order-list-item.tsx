import { useRouter } from 'next/navigation';
import { FC } from 'react';

import PrimaryButton from '@/components/ui/buttons/primary-button';
import { OrderStatus } from '@/enums/order/order-status.constant';
import { IOrderSummaryData } from '@/types/order/order-data.type';
import { NumberDisplayHelper } from '@/utils/shared/display-helper/number-display-helper';

import { OrderStatusBadge } from '../../shared/order-status-badge';

type OrderListItemProps = {
  order: IOrderSummaryData;
  sellerId: string;
};

export const OrderListItem: FC<OrderListItemProps> = ({ order, sellerId }) => {
  const router = useRouter();

  const shipOutButtonOnClickHandler = () => {
    router.push(`/seller/${sellerId}/order/${order.uuid}/ship-out`);
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
          <OrderStatusBadge
            status={order.status}
            sellerMode
          />
        </div>
      </div>

      {/* Order Action */}
      <div className="w-[170px] flex justify-end">
        {order.status === OrderStatus.PENDING_SELLER_SHIP_OUT && (
          <PrimaryButton
            buttonStyle="contained"
            onClick={shipOutButtonOnClickHandler}
          >
            Ship Out
          </PrimaryButton>
        )}
      </div>
    </li>
  );
};
