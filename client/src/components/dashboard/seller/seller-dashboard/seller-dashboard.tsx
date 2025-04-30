'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { FC, useEffect } from 'react';

import PrimaryButton from '@/components/ui/buttons/primary-button';
import { AppHero } from '@/components/ui/hero/app-hero';
import { useGetSeller } from '@/hooks/queries/seller/get-seller/get-seller';

const SellerDashboard: FC = () => {
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

  const redirectToViewProductListPage = () => {
    router.push(`/seller/${sellerData.uuid}/product`);
  };

  return (
    <>
      <div>
        <AppHero
          title={`Welcome back to Seller Board`}
          subtitle={`${sellerData.name}`}
          padding={64}
        >
          <PrimaryButton onClick={redirectToViewProductListPage}>
            View Products
          </PrimaryButton>
        </AppHero>
      </div>
    </>
  );
};

export default SellerDashboard;
