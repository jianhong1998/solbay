'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { FC, useEffect } from 'react';
import toast from 'react-hot-toast';

import SellerRegisterForm from '@/components/form/seller-register-form/seller-register-form';
import { AppHero } from '@/components/ui/hero/app-hero';
import Loading from '@/components/ui/loading/loading';
import { useGetSeller } from '@/hooks/queries/seller/get-seller/get-seller';
import { ErrorHandler } from '@/utils/shared/error-handler';

const SellerPreLoginDashboard: FC = () => {
  const router = useRouter();
  const { connected: isWalletConnected } = useWallet();
  const { data: getSellerData, error: getSellerError } = useGetSeller();

  useEffect(() => {
    if (getSellerError) {
      const statusCode =
        ErrorHandler.extractStatusCodeFromError(getSellerError);

      if (statusCode === 404) {
        return;
      }

      const errorMessage = ErrorHandler.extractErrorMessage(getSellerError);
      toast.error(errorMessage);
    }
  }, [getSellerError]);

  if (getSellerData) {
    router.replace(`/seller/${getSellerData.uuid}`);
  }

  if (!isWalletConnected) {
    return (
      <AppHero
        title="Welcome to Solbay Seller Hub"
        subtitle="Please login to continue"
        padding={64}
      />
    );
  }

  if (
    !getSellerData &&
    ErrorHandler.extractStatusCodeFromError(getSellerError) === 404
  ) {
    return <SellerRegisterForm />;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
      <Loading
        loadingStyle="spinner"
        size="lg"
      />
    </div>
  );
};

export default SellerPreLoginDashboard;
