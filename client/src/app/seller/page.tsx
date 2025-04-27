'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

import SellerRegisterForm from '@/components/form/seller-register-form/seller-register-form';
import { AppHero } from '@/components/ui/ui-layout';
import { useGetSeller } from '@/hooks/queries/seller/get-seller/get-seller';
import { PageContext } from '@/types/page-context.type';
import { ErrorHandler } from '@/utils/shared/error-handler';

const SellerPage: NextPage<PageContext> = () => {
  const router = useRouter();

  const { publicKey, connected: isWalletConnected } = useWallet();

  const { data: getSellerData, error: getSellerError } =
    useGetSeller(publicKey);

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
    <div className="w-full h-full flex flex-col justify-center">
      <div>
        <span className="loading loading-spinner"></span>
      </div>
    </div>
  );
};

export default SellerPage;
