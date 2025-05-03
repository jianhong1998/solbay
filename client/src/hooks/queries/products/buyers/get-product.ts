'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

import { useServerAxios } from '@/hooks/axios/server-axios-client';
import { IProductWithoutSensitiveData } from '@/types/product/product-without-sensitive-data.type';

type IGetBuyerProductListResponse = {
  products: IProductWithoutSensitiveData[];
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
