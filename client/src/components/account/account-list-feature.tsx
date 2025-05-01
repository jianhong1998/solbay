'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { redirect } from 'next/navigation';

import { WalletButton } from '../solana/solana-provider';

export default function AccountListFeature() {
  const { publicKey } = useWallet();

  if (publicKey) {
    return redirect(`/account/${publicKey.toString()}`);
  }

  return (
    <div className="hero justify-center">
      <WalletButton />
    </div>
  );
}
