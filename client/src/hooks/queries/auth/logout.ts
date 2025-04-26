'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useMutation } from '@tanstack/react-query';

import { useServerAxios } from '@/hooks/axios/server-axios-client';

export const useLogout = () => {
  const { publicKey } = useWallet();
  const serverAxios = useServerAxios();

  return useMutation<null, Error, void>({
    mutationKey: ['auth', 'logout', { publicKey }],
    mutationFn: async () => {
      if (!publicKey) {
        throw new Error('Wallet is not connected!');
      }

      const url = '/auth/logout';
      const body = {
        publicKey: publicKey?.toBase58(),
      };

      await serverAxios.post(url, body);

      return null;
    },
  });
};
