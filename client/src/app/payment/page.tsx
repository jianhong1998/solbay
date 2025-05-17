import { NextPage } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { TOKEN_COOKIE_NAME } from '@/constants/cookie.constant';
import { PageContext } from '@/types/page-context.type';

import LoginRequired from './login-required';

type PaymentPageProps = {};

type PaymentPageSearchParams = {
  transaction: string;
  orderId: string;
};

const PaymentPage: NextPage<
  PageContext<PaymentPageProps, PaymentPageSearchParams>
> = async ({ searchParams }) => {
  const cookieStorage = cookies();
  const authToken = cookieStorage.get(TOKEN_COOKIE_NAME);
  const { orderId, transaction } = await searchParams;

  if (!orderId || !transaction) redirect('/');
  if (!authToken) return <LoginRequired />;

  return <></>;
};

export default PaymentPage;
