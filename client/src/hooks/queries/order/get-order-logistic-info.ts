'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useServerAxios } from '@/hooks/axios/server-axios-client';

type IGetOrderLogisticInfoResponse = {
  uuid: string;
  recipientName: string;
  countryCode: number;
  contactNumber: number;
  streetLine1: string;
  streetLine2: string | null;
  streetLine3: string | null;
  postalCode: number;
  city: string;
  country: string;
};

const getQueryKeyForGetOrderLogisticInfo = (
  publicKey: string | null,
  orderId: string,
) => ['order-logistic-info', 'get-one', { orderId, publicKey }];

export const useGetOrderLogisticInfo = (orderId: string) => {
  const serverAxios = useServerAxios();
  const { publicKey } = useWallet();
  const publicKeyString = publicKey?.toBase58() ?? null;

  const query = useQuery({
    queryKey: getQueryKeyForGetOrderLogisticInfo(publicKeyString, orderId),
    queryFn: async () => {
      if (!serverAxios.isInitialized) throw new Error('Pending initialized.');

      const url = `/order/${orderId}/logistic-info`;
      const res = await serverAxios.get<IGetOrderLogisticInfoResponse>(url);

      return res.data;
    },
    enabled: serverAxios.isInitialized && Boolean(publicKey),
    gcTime: 5 * 60 * 1000, // 5 mins
    staleTime: 5 * 60 * 1000, // 5 mins
    refetchOnMount: false,
    refetchOnReconnect: true,
    retry: 2,
  });

  useEffect(() => {
    if (query.isStale && query.isSuccess) query.refetch();
  }, [query]);

  return query;
};
