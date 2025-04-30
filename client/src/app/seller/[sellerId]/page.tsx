import { NextPage } from 'next';

import SellerDashboard from '@/components/dashboard/seller/seller-dashboard/seller-dashboard';
import { PageContext } from '@/types/page-context.type';

type SellerDashboardPageProps = {
  sellerId: string;
};

const SellerDashboardPage: NextPage<
  PageContext<SellerDashboardPageProps>
> = () => {
  return <SellerDashboard />;
};

export default SellerDashboardPage;
