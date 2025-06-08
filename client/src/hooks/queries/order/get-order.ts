'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useServerAxios } from '@/hooks/axios/server-axios-client';
import { IOrderSummaryData } from '@/types/order/order-data.type';

type IGetAllOrderResponse = {
  orders: IOrderSummaryData[];
};

export const getQueryKeyForGetAllBuyerOrder = (publicKey: string | null) => {
  return ['order', 'get-all', 'buyer', { publicKey }];
};

export const getQueryKeyForGetAllSellerOrder = (publicKey: string | null) => {
  return ['order', 'get-all', 'seller', { publicKey }];
};

export const useGetAllBuyerOrders = () => {
  const serverAxios = useServerAxios();
  const { publicKey } = useWallet();
  const publicKeyString = publicKey?.toBase58() ?? null;

  const query = useQuery<IOrderSummaryData[], Error>({
    queryKey: getQueryKeyForGetAllBuyerOrder(publicKeyString),
    queryFn: async () => {
      const url = '/order';

      const res = await serverAxios.get<IGetAllOrderResponse>(url);

      return res.data.orders;
    },
    gcTime: 5 * 60 * 1000, // 5 mins
    staleTime: 5 * 60 * 1_000, // 5 mins
    refetchOnReconnect: true,
    refetchOnMount: false,
    enabled: Boolean(publicKey) && serverAxios.isInitialized,
  });

  useEffect(() => {
    if (query.isSuccess && query.isStale) {
      query.refetch();
    }
  }, [query]);

  return query;
};

export const useGetAllSellerOrders = () => {
  const serverAxios = useServerAxios();
  const { publicKey } = useWallet();
  const publicKeyString = publicKey?.toBase58() ?? null;

  const query = useQuery<IOrderSummaryData[], Error>({
    queryKey: getQueryKeyForGetAllSellerOrder(publicKeyString),
    queryFn: async () => {
      const url = `/order?${new URLSearchParams({ asSeller: 'true' })}`;

      const res = await serverAxios.get<IGetAllOrderResponse>(url);
      return res.data.orders;
    },
    enabled: serverAxios.isInitialized && Boolean(publicKey),
    staleTime: 5 * 60 * 1000, // 5 mins
    gcTime: 5 * 60 * 1000, // 5 mins
    refetchOnReconnect: true,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (query.isSuccess && query.isStale) {
      query.refetch();
    }
  }, [query]);

  return query;
};
