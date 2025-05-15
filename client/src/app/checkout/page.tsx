import { NextPage } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import CheckoutFeature from '@/components/checkout/checkout-feature';
import { TOKEN_COOKIE_NAME } from '@/constants/cookie.constant';
import { PageContext } from '@/types/page-context.type';

import LoginRequired from './login-required';

type CheckoutPageSearchParams = {
  productId?: string;
};

const CheckoutPage: NextPage<
  PageContext<{}, CheckoutPageSearchParams>
> = async ({ searchParams }) => {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME);
  const { productId } = await searchParams;

  if (!productId) redirect('/products');
  if (!token) return <LoginRequired />;

  return <CheckoutFeature productId={productId} />;
};

export default CheckoutPage;
