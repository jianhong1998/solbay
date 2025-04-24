'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { AppHero, ellipsify } from '../ui/ui-layout';
import { ExplorerLink } from '../cluster/cluster-ui';
import { useSolbayProgram } from './solbay-data-access';

export default function SolbayFeature() {
  const { publicKey, signTransaction } = useWallet();
  const { programId } = useSolbayProgram();

  if (publicKey && signTransaction)
    return (
      <div>
        <AppHero
          title="Solbay"
          subtitle=""
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
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">Not Logged In Yet</div>
      </div>
    </div>
  );
}
