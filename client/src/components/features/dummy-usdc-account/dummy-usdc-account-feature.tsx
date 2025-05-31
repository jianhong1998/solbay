'use client';

import { FC, useEffect } from 'react';
import toast from 'react-hot-toast';

import FullPageLoading from '@/components/ui/loading/full-page-loading';
import { useGetDummyUsdcTokenAccount } from '@/hooks/queries/dummy-usdc/get-token-account';
import { ErrorHandler } from '@/utils/shared/error-handler';

import { CreateDummyUsdcTokenAccount } from './create-dummy-usdc-token-account';
import { DummyUsdcAccountCard } from './dummy-usdc-account-card/dummy-usdc-account-card';

export const DummyUsdcAccountFeature: FC = () => {
  const {
    data: tokenAccount,
    error: getTokenAccountError,
    isFetched: isTokenAccountFetched,
    refetch: refetchTokenAccount,
  } = useGetDummyUsdcTokenAccount();

  const refreshHandler = async () => {
    await refetchTokenAccount();
  };

  useEffect(() => {
    if (!getTokenAccountError) return;

    const errorMessage = ErrorHandler.extractErrorMessage(getTokenAccountError);
    toast.error(errorMessage);
  }, [getTokenAccountError]);

  if (!isTokenAccountFetched) return <FullPageLoading />;

  if (!tokenAccount) {
    return <CreateDummyUsdcTokenAccount />;
  }

  return (
    <div className="mt-3">
      <DummyUsdcAccountCard
        walletPublicKey={tokenAccount.owner}
        balance={tokenAccount.amount}
        refreshFn={refreshHandler}
      />
    </div>
  );
};
