import { NextPage } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import SellerDashboard from '@/components/dashboard/seller/seller-dashboard/seller-dashboard';
import { TOKEN_COOKIE_NAME } from '@/constants/cookie.constant';
import { PageContext } from '@/types/page-context.type';

type SellerDashboardPageProps = {
  sellerId: string;
};

const SellerDashboardPage: NextPage<
  PageContext<SellerDashboardPageProps>
> = () => {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME);

  if (!token) {
    redirect('/seller');
  }

  return <SellerDashboard />;
};

export default SellerDashboardPage;
