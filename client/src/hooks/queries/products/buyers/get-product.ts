'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

import { useServerAxios } from '@/hooks/axios/server-axios-client';
import { IProductWithoutSensitiveData } from '@/types/product/product-without-sensitive-data.type';

type IGetBuyerProductListResponse = {
  products: IProductWithoutSensitiveData[];
};

type IGetBuyerProductDetailsResponse = {
  product: IProductWithoutSensitiveData;
};

export const useGetBuyerProductList = () => {
  const serverAxios = useServerAxios();
  const { publicKey } = useWallet();
  const publicKeyString = publicKey?.toBase58() ?? null;

  return useQuery<IGetBuyerProductListResponse>({
    queryKey: ['buyer-product', 'all', { publicKey: publicKeyString }],
    queryFn: async () => {
      const res =
        await serverAxios.get<IGetBuyerProductListResponse>('/product');

      return res.data;
    },
    enabled: serverAxios.isInitialized,
  });
};

export const useGetBuyerProductDetails = (productId: string) => {
  const serverAxios = useServerAxios();
  const { publicKey } = useWallet();
  const publicKeyString = publicKey?.toBase58() ?? null;

  return useQuery<IGetBuyerProductDetailsResponse, Error>({
    queryKey: [
      'buyer-product',
      'one',
      { productId, publicKey: publicKeyString },
    ],
    queryFn: async () => {
      const url = encodeURI(`/product/${productId}`);
      const res = await serverAxios.get<IGetBuyerProductDetailsResponse>(url);

      return res.data;
    },
    enabled: Boolean(publicKey) && serverAxios.isInitialized,
    staleTime: 5000,
    retry: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });
};
