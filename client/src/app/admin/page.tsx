import { NextPage } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ViewEscrowOperationAccount } from '@/components/features/admin/escrow-operation-account/view-escrow-operation-account';
import { TOKEN_COOKIE_NAME } from '@/constants/cookie.constant';

const AdminPage: NextPage = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME);

  if (!token) {
    redirect('/');
  }

  return <ViewEscrowOperationAccount />;
};

export default AdminPage;
