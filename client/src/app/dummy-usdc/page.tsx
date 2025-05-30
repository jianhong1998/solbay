import { NextPage } from 'next';
import { cookies } from 'next/headers';

import { DummyUsdcAccountFeature } from '@/components/features/dummy-usdc-account/dummy-usdc-account-feature';
import { TOKEN_COOKIE_NAME } from '@/constants/cookie.constant';

import LoginRequired from './login-required';

const DummyUsdcPage: NextPage = () => {
  const cookieStorage = cookies();
  const token = cookieStorage.get(TOKEN_COOKIE_NAME);

  if (!token) return <LoginRequired />;

  return <DummyUsdcAccountFeature />;
};

export default DummyUsdcPage;
