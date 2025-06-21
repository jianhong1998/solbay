'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { UsdcAccountCard } from '@/components/account/usdc-account/usdc-account-card';
import PrimaryButton from '@/components/ui/buttons/primary-button';
import FullPageLoading from '@/components/ui/loading/full-page-loading';
import { useGetEscrowOperationAccountPublicKey } from '@/hooks/queries/admin/get-escrow-operation-account';
import { useGetTokenAccount } from '@/hooks/queries/token-account/get-token-account';
import { ErrorHandler } from '@/utils/shared/error-handler';

import { WithdrawProfitModal } from './withdraw-profit-modal';

export const ViewEscrowOperationAccount = () => {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] =
    useState<boolean>(false);

  const {
    data: accountPublicKeyData,
    error: getAccountPublicKeyError,
    isFetched: isAccountPublicKeyFetched,
  } = useGetEscrowOperationAccountPublicKey();

  const { data: tokenAccount, error: getTokenAccountError } =
    useGetTokenAccount(accountPublicKeyData?.publicKey ?? '');

  const toggleWithdrawPopup = () => {
    setIsWithdrawModalOpen((prev) => !prev);
  };

  /* Error handling */
  useEffect(() => {
    if (!getAccountPublicKeyError && !getTokenAccountError) return;

    const errors = [] as unknown[];

    if (getAccountPublicKeyError) errors.push(getAccountPublicKeyError);
    if (getTokenAccountError) errors.push(getTokenAccountError);

    errors.forEach((error) => {
      const message = ErrorHandler.extractErrorMessage(error);
      toast.error(message);
    });
  }, [getAccountPublicKeyError, getTokenAccountError]);

  if (!isAccountPublicKeyFetched || !accountPublicKeyData)
    return <FullPageLoading />;

  return (
    <div>
      <UsdcAccountCard
        walletPublicKey={accountPublicKeyData.publicKey}
        title="Escrow Operation Account"
        actionComponent={
          <PrimaryButton onClick={toggleWithdrawPopup}>
            Withdraw Profit
          </PrimaryButton>
        }
      />
      <WithdrawProfitModal
        isOpen={isWithdrawModalOpen}
        closeModalFn={toggleWithdrawPopup}
        escrowOperationAccountPublicKey={accountPublicKeyData.publicKey}
        maxAvailableProfit={tokenAccount?.amount ?? 0}
      />
    </div>
  );
};
