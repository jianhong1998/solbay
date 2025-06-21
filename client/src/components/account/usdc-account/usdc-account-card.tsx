'use client';

import { FC, ReactNode, useCallback, useMemo } from 'react';

import { useGetTokenAccount } from '@/hooks/queries/token-account/get-token-account';

import { UsdcAccountCardPresentation } from './usdc-account-card-presentation';

type UsdcAccountCardProps = {
  walletPublicKey: string;
  title?: string;
  actionComponent?: ReactNode;
};

export const UsdcAccountCard: FC<UsdcAccountCardProps> = ({
  walletPublicKey,
  actionComponent,
  title,
}) => {
  const { data: accountData, refetch: refetchTokenAccount } =
    useGetTokenAccount(walletPublicKey);

  const balance = useMemo<number | undefined>(() => {
    if (!accountData) return undefined;
    return accountData.amount;
  }, [accountData]);

  const refreshTokenAccount = useCallback(async () => {
    await refetchTokenAccount();
  }, [refetchTokenAccount]);

  return (
    <UsdcAccountCardPresentation
      balance={balance ?? 0}
      refreshFn={refreshTokenAccount}
      walletPublicKey={walletPublicKey}
      actionComponent={actionComponent}
      title={title}
    />
  );
};
