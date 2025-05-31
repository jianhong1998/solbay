'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { GeneralErrorMessage } from '@/constants/error.constant';
import { useServerAxios } from '@/hooks/axios/server-axios-client';
import { ErrorHandler } from '@/utils/shared/error-handler';

type IAirdropUsdcParams = {
  amount: number;
};

type IAirdropUsdcRes = {
  publicKey: string;
  balance: number;
};

export const useAirdropUsdc = () => {
  const serverAxios = useServerAxios();
  const { publicKey } = useWallet();
  const publicKeyString = publicKey?.toBase58() ?? null;
  const queryClient = useQueryClient();

  return useMutation<IAirdropUsdcRes, Error, IAirdropUsdcParams>({
    mutationKey: [
      'dummy-usdc-account',
      'airdrop',
      { publicKey: publicKeyString },
    ],
    mutationFn: async ({ amount }) => {
      if (!publicKeyString) throw new Error('Wallet is not connected!');

      const url = '/internal/dummy-usdc/airdrop';
      const body = {
        recipient: publicKeyString,
        amount,
      };

      const res = await serverAxios.post(url, body);

      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['dummy-usdc-account', 'get', { publicKey: publicKeyString }],
      });
    },
    onError: (error) => {
      const errorMessage = ErrorHandler.extractErrorMessage(error);
      const errorStatus = ErrorHandler.extractStatusCodeFromError(error);

      if (errorStatus === 'ERR_NETWORK') {
        toast.error(GeneralErrorMessage.NETWORK_ERROR);
        return;
      }

      toast.error(errorMessage);
    },
  });
};
