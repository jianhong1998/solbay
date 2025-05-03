'use client';

import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { GeneralErrorMessage } from '@/constants/error.constant';
import { useServerAxios } from '@/hooks/axios/server-axios-client';
import { IProductWithoutSensitiveData } from '@/types/product/product-without-sensitive-data.type';
import { ErrorHandler } from '@/utils/shared/error-handler';

export type IAddProductResult = IProductWithoutSensitiveData;

type IAddProductParams = {
  name: string;
  description: string;
  priceInLamport: number;
  isPublish: boolean;
};

export const useAddProduct = () => {
  const serverAxios = useServerAxios();

  return useMutation<IAddProductResult, Error, IAddProductParams>({
    mutationKey: ['seller-product', 'create'],
    mutationFn: async ({ name, description, priceInLamport, isPublish }) => {
      const url = '/seller-product';
      const result = await serverAxios.post<IAddProductResult>(url, {
        name,
        description,
        priceInLamport,
        isPublish,
      });

      return result.data;
    },
    onError: (error) => {
      const errorStatus = ErrorHandler.extractStatusCodeFromError(error);
      const errorMessage = ErrorHandler.extractErrorMessage(error);

      if (errorStatus === 'ERR_NETWORK') {
        toast.error(GeneralErrorMessage.NETWORK_ERROR);
        return;
      }

      toast.error(errorMessage);
    },
    onSuccess: (_data) => {
      toast.success('Successfully added product!');
    },
  });
};
