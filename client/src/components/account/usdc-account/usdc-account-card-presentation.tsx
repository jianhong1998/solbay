import { FC, ReactNode } from 'react';

import { ExplorerLink } from '@/components/cluster/cluster-ui';
import { ellipsify } from '@/components/ui/ui-layout';
import { NumberDisplayHelper } from '@/utils/shared/display-helper/number-display-helper';

type UsdcAccountCardPresentationProps = {
  walletPublicKey: string;
  balance: number;
  refreshFn: () => Promise<void>;
  title?: string;
  actionComponent?: ReactNode;
};

export const UsdcAccountCardPresentation: FC<
  UsdcAccountCardPresentationProps
> = ({ balance, walletPublicKey, refreshFn, actionComponent, title }) => {
  return (
    <div className="p-3 shadow-xl rounded-3xl dark:bg-gray-900">
      <div className="flex flex-col items-center gap-3">
        {title && (
          <div className="text-2xl font-bold cursor-default">{title}</div>
        )}

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

        <div>{actionComponent}</div>
      </div>
    </div>
  );
};
