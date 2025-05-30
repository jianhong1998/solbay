'use client';

import { FC, useEffect } from 'react';
import toast from 'react-hot-toast';

import FullPageLoading from '@/components/ui/loading/full-page-loading';
import { useGetDummyUsdcTokenAccount } from '@/hooks/queries/dummy-usdc/get-token-account';
import { ErrorHandler } from '@/utils/shared/error-handler';

import { CreateDummyUsdcTokenAccount } from './create-dummy-usdc-token-account';

export const DummyUsdcAccountFeature: FC = () => {
  const {
    data: tokenAccount,
    error: getTokenAccountError,
    isFetched: isTokenAccountFetched,
  } = useGetDummyUsdcTokenAccount();

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
    <div>
      <div>{tokenAccount.publicKey}</div>
      <div>{tokenAccount.owner}</div>
      <div>{tokenAccount.amount}</div>
    </div>
  );
};
