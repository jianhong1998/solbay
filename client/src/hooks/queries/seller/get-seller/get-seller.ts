'use client';

import { PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';

import { useServerAxios } from '@/hooks/axios/server-axios-client';

type IGetSellerResponse = {
  uuid: string;
  name: string;
  email?: string;
};

export const useGetSeller = (publicKey: PublicKey | null) => {
  const serverAxios = useServerAxios();

  return useQuery<IGetSellerResponse, Error>({
    queryKey: ['seller', publicKey?.toBase58() ?? null],
    queryFn: async () => {
      const url = encodeURI(`/seller/${publicKey?.toBase58()}`);
      const result = await serverAxios.get<IGetSellerResponse>(url);

      return result.data;
    },
    refetchOnReconnect: true,
    refetchOnMount: true,
    enabled: Boolean(publicKey) && serverAxios.isInitialized,
    retry: false,
  });
};
