'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useServerAxios } from '@/hooks/axios/server-axios-client';

type IGetTokenAccountRes = {
  publicKey: string;
};

export const queryKeyForGetEscrowOperationAccountPublicKey = () => [
  'escrow-operation-account',
  'get',
];

export const useGetEscrowOperationAccountPublicKey = () => {
  const serverAxios = useServerAxios();

  const query = useQuery({
    queryKey: queryKeyForGetEscrowOperationAccountPublicKey(),
    queryFn: async () => {
      const url = '/escrow/operation-account';
      const res = await serverAxios.get<IGetTokenAccountRes>(url);
      return res.data;
    },
    enabled: serverAxios.isInitialized,
    staleTime: 5 * 60 * 1000, // 5 mins
    gcTime: 5 * 60 * 1000, // 5 mins
  });

  useEffect(() => {
    if (!query.isFetched || !query.isStale) return;

    query.refetch();
  }, [query]);

  return query;
};
