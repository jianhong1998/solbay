import { NextPage } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { TOKEN_COOKIE_NAME } from '@/constants/cookie.constant';
import { PageContext } from '@/types/page-context.type';

import LoginRequired from './login-required';

type PaymentPageProps = {};

type PaymentPageSearchParams = {
  orderId?: string;
};

const extractOrderIdsFromQuery = (query: string): string[] => {
  return query.split(',');
};

const PaymentPage: NextPage<
  PageContext<PaymentPageProps, PaymentPageSearchParams>
> = async ({ searchParams }) => {
  const cookieStorage = cookies();
  const authToken = cookieStorage.get(TOKEN_COOKIE_NAME);
  const { orderId: orderIdQuery } = await searchParams;

  if (!orderIdQuery) redirect('/');
  if (!authToken) return <LoginRequired />;

  const orderIds = extractOrderIdsFromQuery(orderIdQuery);
  if (!orderIds.length) redirect('/');

  return <></>;
};

export default PaymentPage;
