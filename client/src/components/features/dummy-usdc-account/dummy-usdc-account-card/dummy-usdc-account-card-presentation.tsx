import { FC } from 'react';

import { ExplorerLink } from '@/components/cluster/cluster-ui';
import PrimaryButton from '@/components/ui/buttons/primary-button';
import { ellipsify } from '@/components/ui/ui-layout';
import { NumberDisplayHelper } from '@/utils/shared/display-helper/number-display-helper';

type DummyUsdcAccountCardPresentationProps = {
  walletPublicKey: string;
  balance: number;
  refreshFn: () => Promise<void>;
  toggleAirdropPopup: () => void;
};

export const DummyUsdcAccountCardPresentation: FC<
  DummyUsdcAccountCardPresentationProps
> = ({ balance, walletPublicKey, refreshFn, toggleAirdropPopup }) => {
  return (
    <div className="p-3 shadow-xl rounded-3xl dark:bg-gray-900">
      <div className="flex flex-col items-center gap-3">
        <div
          className="text-5xl font-bold cursor-pointer"
          onClick={refreshFn}
        >
          {NumberDisplayHelper.convertNumberToDisplayString(balance)} USDC
        </div>

        <div>
          <ExplorerLink
            path={`account/${walletPublicKey}`}
            label={ellipsify(walletPublicKey)}
          />
        </div>

        <div>
          <PrimaryButton onClick={toggleAirdropPopup}>
            Request Airdrop
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
