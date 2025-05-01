import { NextPage } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import SellerProductDashboard from '@/components/dashboard/seller/seller-product-list-dashboard/seller-product-list-dashboard';
import { TOKEN_COOKIE_NAME } from '@/constants/cookie.constant';
import { PageContext } from '@/types/page-context.type';

type SellerProductPageProps = {
  sellerId: string;
};

const SellerProductPage: NextPage<
  PageContext<SellerProductPageProps>
> = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME);

  if (!token) {
    redirect('/seller');
  }

  return <SellerProductDashboard />;
};

export default SellerProductPage;
