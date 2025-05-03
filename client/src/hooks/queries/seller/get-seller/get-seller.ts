'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

import { useServerAxios } from '@/hooks/axios/server-axios-client';

export type IGetSellerResponse = {
  uuid: string;
  name: string;
  email?: string;
};

export const useGetSeller = () => {
  const serverAxios = useServerAxios();
  const { publicKey } = useWallet();
  const publicKeyString = publicKey?.toBase58() ?? null;

  return useQuery<IGetSellerResponse, Error>({
    queryKey: ['seller', { publicKey: publicKeyString }],
    queryFn: async () => {
      const url = encodeURI(`/seller/${publicKeyString}`);
      const result = await serverAxios.get<IGetSellerResponse>(url);

      return result.data;
    },
    refetchOnReconnect: true,
    refetchOnMount: true,
    enabled: Boolean(publicKey) && serverAxios.isInitialized,
    retry: false,
  });
};
