'use client';

import '@solana/wallet-adapter-react-ui/styles.css';

import { AnchorProvider } from '@coral-xyz/anchor';
import { WalletError } from '@solana/wallet-adapter-base';
import {
  AnchorWallet,
  ConnectionProvider,
  useConnection,
  useWallet,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import dynamic from 'next/dynamic';
import { ReactNode, useCallback, useMemo } from 'react';

import { useLogger } from '@/utils/shared/logger';

import { useCluster } from '../cluster/cluster-data-access';

export const WalletButton = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  {
    ssr: false,
  },
);

export function SolanaProvider({ children }: { children: ReactNode }) {
  const logger = useLogger();
  const { cluster } = useCluster();
  const endpoint = useMemo(() => cluster.endpoint, [cluster]);
  const onError = useCallback(
    (error: WalletError) => {
      logger.error(error);
    },
    [logger],
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={[]}
        onError={onError}
        autoConnect={true}
      >
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export function useAnchorProvider() {
  const { connection } = useConnection();
  const wallet = useWallet();

  return new AnchorProvider(connection, wallet as AnchorWallet, {
    commitment: 'confirmed',
  });
}
