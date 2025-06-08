'use client';

import { useRouter } from 'next/navigation';
import { FC } from 'react';

import PrimaryButton from '@/components/ui/buttons/primary-button';
import { AppHero } from '@/components/ui/hero/app-hero';
import FullPageLoading from '@/components/ui/loading/full-page-loading';
import { useGetSeller } from '@/hooks/queries/seller/get-seller/get-seller';

import SellerNotFoundDashboard from './seller-not-found';

const SellerDashboard: FC = () => {
  const router = useRouter();

  const { data: sellerData, isFetched: isGetSellerExecuted } = useGetSeller();

  const redirectToViewProductListPage = () => {
    if (!sellerData) return;
    router.push(`/seller/${sellerData.uuid}/product`);
  };

  const redirectToViewOrderListPage = () => {
    if (!sellerData) return;
    router.push(`/seller/${sellerData.uuid}/order`);
  };

  if (!sellerData) {
    if (isGetSellerExecuted) {
      return <SellerNotFoundDashboard />;
    } else {
      return <FullPageLoading />;
    }
  }

  return (
    <>
      <div>
        <AppHero
          title={`Welcome back to Seller Board`}
          subtitle={`${sellerData.name}`}
          padding={64}
        >
          <div className="flex flex-col justify-center gap-4 lg:flex-row ">
            <PrimaryButton onClick={redirectToViewProductListPage}>
              My Products
            </PrimaryButton>
            <PrimaryButton onClick={redirectToViewOrderListPage}>
              My Orders
            </PrimaryButton>
          </div>
        </AppHero>
      </div>
    </>
  );
};

export default SellerDashboard;
