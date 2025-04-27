'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { AppHero } from '@/components/ui/ui-layout';
import { useGetSeller } from '@/hooks/queries/seller/get-seller/get-seller';
import { PageContext } from '@/types/page-context.type';

type SellerDashboardPageProps = {
  sellerId: string;
};

const SellerDashboardPage: NextPage<
  PageContext<SellerDashboardPageProps>
> = () => {
  const router = useRouter();

  const { publicKey } = useWallet();
  const { data: sellerData } = useGetSeller(publicKey);

  useEffect(() => {
    if (!sellerData) {
      router.replace('/seller');
    }
  }, [sellerData, router]);

  if (!sellerData) {
    return <></>;
  }

  return (
    <div>
      <AppHero
        title={`Welcome back ${sellerData?.name}`}
        subtitle=""
      />
    </div>
  );
};

export default SellerDashboardPage;
