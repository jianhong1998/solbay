import { FC, useState } from 'react';

import { useAirdropUsdc } from '@/hooks/queries/dummy-usdc/airdrop-usdc';

import { DummyUsdcAirdropRequestPopup } from './airdrop-request-popup-presentation';
import { DummyUsdcAccountCardPresentation } from './dummy-usdc-account-card-presentation';

type DummyUsdcAccountCardProps = {
  walletPublicKey: string;
  balance: number;
  refreshFn: () => Promise<void>;
};

export const DummyUsdcAccountCard: FC<DummyUsdcAccountCardProps> = ({
  walletPublicKey,
  balance,
  refreshFn,
}) => {
  const [isRequestUsdcAirdropPopupOpen, setIsRequestUsdcAirdropPopupOpen] =
    useState<boolean>(false);
  const { mutateAsync: requestAirdropFn, isPending: isRequestingAirdrop } =
    useAirdropUsdc();

  const toggleAirdropPopupFn = () => {
    setIsRequestUsdcAirdropPopupOpen((prev) => !prev);
  };
  const requestAirdropHandler = async (amount: number) => {
    await requestAirdropFn({
      amount,
    });

    setIsRequestUsdcAirdropPopupOpen(false);
  };

  return (
    <>
      <DummyUsdcAccountCardPresentation
        walletPublicKey={walletPublicKey}
        balance={balance}
        refreshFn={refreshFn}
        toggleAirdropPopup={toggleAirdropPopupFn}
      />
      <DummyUsdcAirdropRequestPopup
        isOpen={isRequestUsdcAirdropPopupOpen}
        closePopupFn={toggleAirdropPopupFn}
        isAirdropPending={isRequestingAirdrop}
        requestAirdropHandler={requestAirdropHandler}
      />
    </>
  );
};
