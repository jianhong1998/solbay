'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { useServerAxios } from '@/hooks/axios/server-axios-client';
import { useLogger } from '@/utils/shared/logger';

type IVerifyTokenResDTO = {
  isTokenValid: boolean;
  message: string | null;
};

export const useVerifyToken = () => {
  const serverAxios = useServerAxios();
  const { publicKey } = useWallet();
  const logger = useLogger();

  const [isTokenVerified, setIsTokenVerified] = useState<boolean>(false);

  useEffect(() => {
    setIsTokenVerified(false);
  }, [publicKey]);

  return useQuery<boolean, Error, void>({
    queryKey: ['auth', 'verify-token', { publicKey }],
    enabled:
      serverAxios.isInitialized && !isTokenVerified && Boolean(publicKey),
    refetchOnReconnect: true,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      try {
        const url = '/auth/verify-token';
        const { data: result } = await serverAxios.post<IVerifyTokenResDTO>(
          url,
          {
            publicKey: publicKey?.toBase58(),
          },
        );

        if (!result.isTokenValid) {
          if (result.message) {
            throw new Error(result.message);
          }

          throw new Error('Invalid token.');
        }

        setIsTokenVerified(true);
        return true;
      } catch (error) {
        setIsTokenVerified(false);

        if (isAxiosError(error)) {
          if (error.status === 401) {
            return false;
          }
        }

        if (error && typeof error === 'object' && 'message' in error) {
          logger.log(error.message);
        } else {
          logger.log(error);
        }

        toast.error('Login session expired. Please login again.');

        return false;
      }
    },
  });
};
