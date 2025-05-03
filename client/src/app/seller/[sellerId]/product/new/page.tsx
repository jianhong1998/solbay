import { NextPage } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import CreateProductFeature from '@/components/product/create-product/create-product-feature';
import { TOKEN_COOKIE_NAME } from '@/constants/cookie.constant';

const CreateProductPage: NextPage = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME);

  if (!token) redirect('/seller');

  return <CreateProductFeature />;
};

export default CreateProductPage;
