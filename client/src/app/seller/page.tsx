import { NextPage } from 'next';
import { cookies } from 'next/headers';

import SellerPreLoginDashboard from '@/components/dashboard/seller/seller-dashboard/seller-pre-login-dashboard';
import { AppHero } from '@/components/ui/hero/app-hero';
import { TOKEN_COOKIE_NAME } from '@/constants/cookie.constant';

const LoginPrompt = () => {
  return (
    <AppHero
      title="Welcome to Solbay Seller Hub"
      subtitle="Please login to continue"
      padding={64}
    />
  );
};

const SellerPage: NextPage = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME);

  if (!token) return <LoginPrompt />;

  return <SellerPreLoginDashboard />;
};

export default SellerPage;
