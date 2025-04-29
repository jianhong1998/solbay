'use client';

import { PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';

import { useServerAxios } from '@/hooks/axios/server-axios-client';
import { IProductWithoutSensitiveData } from '@/types/product/product-without-sensitive-data.type';

type IGetSellerProductListResponse = {
  products: Array<IProductWithoutSensitiveData>;
};

export const useGetSellerProductList = (publicKey: PublicKey | null) => {
  const serverAxios = useServerAxios();

  return useQuery<IGetSellerProductListResponse, Error>({
    queryKey: ['seller-product', 'list'],
    queryFn: async () => {
      const url = '/seller-product';
      const res = await serverAxios.get<IGetSellerProductListResponse>(url);

      return res.data;
    },
    enabled: serverAxios.isInitialized && Boolean(publicKey),
  });
};
