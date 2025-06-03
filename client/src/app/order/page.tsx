import { NextPage } from 'next';
import { cookies } from 'next/headers';

import { BuyerOrderDashboard } from '@/components/dashboard/order/buyer/order-dashboard';
import Title from '@/components/ui/typography/title';
import { TOKEN_COOKIE_NAME } from '@/constants/cookie.constant';

import LoginRequired from './login-required';

const OrderListPage: NextPage = () => {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME);

  if (!token) return <LoginRequired />;

  return (
    <div>
      <div className="mt-3">
        <Title>Order History</Title>
      </div>
      <BuyerOrderDashboard />
    </div>
  );
};

export default OrderListPage;
