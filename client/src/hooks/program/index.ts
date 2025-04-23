'use client';

import { useCluster } from '@/components/cluster/cluster-data-access';
import { useAnchorProvider } from '@/components/solana/solana-provider';
import { getSolbayProgram, getSolbayProgramId, Solbay } from '@project/anchor';
import { useMemo } from 'react';
import { ClusterType } from './cluster-type';
import { Program } from '@coral-xyz/anchor';

export const useProgram = (): Program<Solbay> => {
  const { cluster } = useCluster();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getSolbayProgramId(cluster.name as ClusterType),
    [cluster],
  );
  const program = useMemo(
    () => getSolbayProgram(provider, programId),
    [programId, provider],
  );

  return program;
};
