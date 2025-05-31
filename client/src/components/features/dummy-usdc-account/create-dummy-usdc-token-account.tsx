'use client';

import { FC } from 'react';

import PrimaryButton from '@/components/ui/buttons/primary-button';
import { useInitDummyUsdcAssociatedTokenAccount } from '@/hooks/queries/dummy-usdc/init-dummy-usdc-account';

export const CreateDummyUsdcTokenAccount: FC = () => {
  const { mutateAsync: initTokenAccountFn } =
    useInitDummyUsdcAssociatedTokenAccount();

  const createButtonOnClickHandler = async () => {
    await initTokenAccountFn();
  };

  return (
    <div className="mt-3 flex justify-center">
      <PrimaryButton onClick={createButtonOnClickHandler}>
        Create Token Account
      </PrimaryButton>
    </div>
  );
};
