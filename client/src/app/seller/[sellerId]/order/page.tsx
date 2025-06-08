import { NextPage } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { TOKEN_COOKIE_NAME } from '@/constants/cookie.constant';

const SellerOrderListPage: NextPage = () => {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME);

  if (!token) redirect('/seller');

  return <></>;
};

export default SellerOrderListPage;
