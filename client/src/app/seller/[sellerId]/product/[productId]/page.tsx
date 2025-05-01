import { NextPage } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import SellerProductDetailsDashboard from '@/components/dashboard/seller/seller-product-details-dashboard/seller-product-details-dashboard';
import { TOKEN_COOKIE_NAME } from '@/constants/cookie.constant';
import { PageContext } from '@/types/page-context.type';

type SellerProductDetailsPageParams = {
  sellerId: string;
  productId: string;
};

const SellerProductDetailsPage: NextPage<
  PageContext<SellerProductDetailsPageParams>
> = async ({ params }) => {
  const { productId, sellerId } = await params;
  const cookieStore = cookies();
  const solbayCookie = cookieStore.get(TOKEN_COOKIE_NAME);

  if (!solbayCookie) {
    redirect('/seller');
  }

  return (
    <SellerProductDetailsDashboard
      productId={productId}
      sellerId={sellerId}
    />
  );
};

export default SellerProductDetailsPage;
