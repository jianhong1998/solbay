import { NextPage } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { HandleShipmentFeature } from '@/components/features/seller/shipment-handler/handle-shipment-feature';
import { TOKEN_COOKIE_NAME } from '@/constants/cookie.constant';
import { PageContext } from '@/types/page-context.type';

type ShipOutPageProps = {
  orderId: string;
  sellerId: string;
};

const ShipOutPage: NextPage<PageContext<ShipOutPageProps>> = async ({
  params,
}) => {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME);
  const { orderId, sellerId } = await params;

  if (!token) redirect('/seller');

  return (
    <HandleShipmentFeature
      orderId={orderId}
      sellerId={sellerId}
    />
  );
};

export default ShipOutPage;
