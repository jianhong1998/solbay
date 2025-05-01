'use client';

import { useRouter } from 'next/navigation';
import { FC } from 'react';

import PrimaryButton from '@/components/ui/buttons/primary-button';
import { AppHero } from '@/components/ui/hero/app-hero';
import { useGetSeller } from '@/hooks/queries/seller/get-seller/get-seller';

const SellerDashboard: FC = () => {
  const router = useRouter();

  const { data: sellerData } = useGetSeller();

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
