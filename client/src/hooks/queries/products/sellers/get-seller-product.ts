'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

import { useServerAxios } from '@/hooks/axios/server-axios-client';
import { IProductWithoutSensitiveData } from '@/types/product/product-without-sensitive-data.type';

type IGetSellerProductListResponse = {
  products: Array<IProductWithoutSensitiveData>;
};

type IGetSellerProductDetailsResponse = {
  product: IProductWithoutSensitiveData;
};

export const useGetSellerProductList = () => {
  const serverAxios = useServerAxios();
  const { publicKey } = useWallet();

  return useQuery<IGetSellerProductListResponse, Error>({
    queryKey: ['seller-product', 'list', { publicKey }],
    queryFn: async () => {
      const url = '/seller-product';
      const res = await serverAxios.get<IGetSellerProductListResponse>(url);

      return res.data;
    },
    enabled: serverAxios.isInitialized && Boolean(publicKey),
  });
};

export const useGetSellerProductDetails = (productId: string) => {
  const serverAxios = useServerAxios();
  const { publicKey } = useWallet();

  return useQuery<IGetSellerProductDetailsResponse, Error>({
    queryKey: [
      'seller-product',
      'one',
      { productId, publicKey: publicKey?.toBase58() ?? null },
    ],
    queryFn: async () => {
      const url = encodeURI(`/seller-product/${productId}`);
      const res = await serverAxios.get<IGetSellerProductDetailsResponse>(url);

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
