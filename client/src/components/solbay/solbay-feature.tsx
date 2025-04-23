'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { AppHero, ellipsify } from '../ui/ui-layout';
import { ExplorerLink } from '../cluster/cluster-ui';
import { useSolbayProgram } from './solbay-data-access';
import { SolbayCreate, SolbayList } from './solbay-ui';

export default function SolbayFeature() {
  const { publicKey, signTransaction } = useWallet();
  const { programId } = useSolbayProgram();

  if (publicKey && signTransaction)
    return (
      <div>
        <AppHero
          title="Solbay"
          subtitle={
            'Create a new account by clicking the "Create" button. The state of a account is stored on-chain and can be manipulated by calling the program\'s methods (increment, decrement, set, and close).'
          }
        >
          <p className="mb-6">
            <ExplorerLink
              path={`account/${programId}`}
              label={ellipsify(programId.toString())}
            />
          </p>
          <SolbayCreate />
        </AppHero>
        <SolbayList />
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
