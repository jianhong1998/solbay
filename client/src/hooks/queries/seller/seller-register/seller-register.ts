'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { GeneralErrorMessage } from '@/constants/error.constant';
import { useServerAxios } from '@/hooks/axios/server-axios-client';
import { ErrorHandler } from '@/utils/shared/error-handler';

export type ISellerRegisterParams = {
  name: string;
  email: string;
};

export type ISellerRegisterResponse = {
  uuid: string;
  name: string;
  email: string;
};

export const useSellerRegister = () => {
  const { publicKey } = useWallet();
  const serverAxios = useServerAxios();
  const queryClient = useQueryClient();

  const publicKeyString = publicKey?.toBase58() ?? null;

  return useMutation<ISellerRegisterResponse, Error, ISellerRegisterParams>({
    mutationKey: ['seller', 'register', { publicKey: publicKeyString }],
    mutationFn: async ({ email, name }) => {
      if (!serverAxios.isInitialized)
        throw new Error(
          GeneralErrorMessage.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN,
        );

      const result = await serverAxios.post<ISellerRegisterResponse>(
        '/seller',
        {
          email,
          name,
        },
      );

      return result.data;
    },
    onError: (error) => {
      const errorMessage = ErrorHandler.extractErrorMessage(error);

      toast.error(errorMessage);
    },
    onSuccess: async (_data) => {
      toast.success('Registered as seller successfully!');

      await queryClient.invalidateQueries({
        queryKey: ['seller', publicKeyString],
      });
    },
  });
};
