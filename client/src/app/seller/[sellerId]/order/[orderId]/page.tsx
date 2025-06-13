import { NextPage } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { OrderDetailsFeature } from '@/components/features/seller/order-details/order-details-feature';
import { TOKEN_COOKIE_NAME } from '@/constants/cookie.constant';
import { PageContext } from '@/types/page-context.type';

type OrderDetailsPageProps = {
  orderId: string;
  sellerId: string;
};

const OrderDetailsPage: NextPage<PageContext<OrderDetailsPageProps>> = async ({
  params,
}) => {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME);
  const { orderId, sellerId } = await params;

  if (!token) redirect('/seller');

  return (
    <OrderDetailsFeature
      orderId={orderId}
      sellerId={sellerId}
    />
  );
};

export default OrderDetailsPage;
