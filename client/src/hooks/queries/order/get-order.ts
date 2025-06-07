'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useServerAxios } from '@/hooks/axios/server-axios-client';
import { IOrderSummaryData } from '@/types/order/order-data.type';

type IGetAllResponse = {
  orders: IOrderSummaryData[];
};

export const getQueryKeyForGetAllBuyerOrder = (publicKey: string | null) => {
  return ['order', 'get-all', 'buyer', { publicKey }];
};

export const useGetAllBuyerOrder = () => {
  const serverAxios = useServerAxios();
  const { publicKey } = useWallet();
  const publicKeyString = publicKey?.toBase58() ?? null;

  const query = useQuery<IOrderSummaryData[], Error>({
    queryKey: getQueryKeyForGetAllBuyerOrder(publicKeyString),
    queryFn: async () => {
      const url = '/order';

      const res = await serverAxios.get<IGetAllResponse>(url);

      return res.data.orders;
    },
    gcTime: 5 * 60 * 1000, // 5 mins
    staleTime: 5 * 60 * 1_000, // 5 mins
    refetchOnReconnect: true,
    enabled: Boolean(publicKey) && serverAxios.isInitialized,
  });

  useEffect(() => {
    if (query.isSuccess && query.isStale) {
      query.refetch();
    }
  }, [query]);

  return query;
};
