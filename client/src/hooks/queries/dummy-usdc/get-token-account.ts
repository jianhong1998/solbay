'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useServerAxios } from '@/hooks/axios/server-axios-client';

type IGetDummyUsdcTokenAccountRes = {
  publicKey: string;
  amount: number;
  status: {
    isFrozen: boolean;
    isInitialized: boolean;
  };
  mint: string;
  owner: string;
};

export const useGetDummyUsdcTokenAccount = () => {
  const { publicKey } = useWallet();
  const publicKeyString = publicKey?.toBase58() ?? null;
  const serverAxios = useServerAxios();

  const query = useQuery({
    queryKey: ['dummy-usdc-account', 'get', { publicKey: publicKeyString }],
    queryFn: async () => {
      const url = '/internal/dummy-usdc-account';
      const res = await serverAxios.get<IGetDummyUsdcTokenAccountRes>(url);
      return res.data;
    },
    enabled: serverAxios.isInitialized && Boolean(publicKey),
    refetchOnReconnect: true,
    staleTime: 10 * 60 * 1_000, // 10 mins
    retry: false,
  });

  useEffect(() => {
    if (query.isStale && query.isSuccess) query.refetch();
  }, [query]);

  return query;
};
