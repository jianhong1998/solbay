import { NextPage } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import CheckoutFeature from '@/components/checkout/checkout-feature';
import { TOKEN_COOKIE_NAME } from '@/constants/cookie.constant';
import { PageContext } from '@/types/page-context.type';

type CheckoutPageSearchParams = {
  productId?: string;
};

const CheckoutPage: NextPage<
  PageContext<{}, CheckoutPageSearchParams>
> = async ({ searchParams }) => {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME);
  const { productId } = await searchParams;

  if (!token || !productId) redirect('/products');

  return <CheckoutFeature productId={productId} />;
};

export default CheckoutPage;
