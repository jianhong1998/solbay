'use client';

import { useWallet } from '@solana/wallet-adapter-react';

import { ExplorerLink } from '../cluster/cluster-ui';
import { AppHero } from '../ui/hero/app-hero';
import { ellipsify } from '../ui/ui-layout';
import { useSolbayProgram } from './solbay-data-access';

export default function BuyerFeature() {
  const { publicKey, signTransaction } = useWallet();
  const { programId } = useSolbayProgram();

  if (publicKey && signTransaction)
    return (
      <div>
        <AppHero
          title="Solbay"
          subtitle=""
          padding={64}
        >
          <p className="mb-6">
            <ExplorerLink
              path={`account/${programId}`}
              label={ellipsify(programId.toString())}
            />
          </p>
        </AppHero>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto justify-center">
      <div className="text-center text-xl font-bold">Not Logged In Yet</div>
    </div>
  );
}
