'use client';

import {
  getAccount,
  getMint,
  TokenAccountNotFoundError,
} from '@solana/spl-token';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';

import { PublicKeyErrorMessage } from '@/constants/error.constant';
import { ReadableTokenAccount } from '@/types/account/readable-token-account.type';

export const getQueryKeyForGetTokenAccountQuery = (publicKey: string) => [
  'token-account',
  'get-one',
  { publicKey },
];

export const useGetTokenAccount = (publicKeyString: string) => {
  const queryKey = getQueryKeyForGetTokenAccountQuery(publicKeyString);
  const { connection } = useConnection();

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const publicKey = new PublicKey(publicKeyString);
        const account = await getAccount(connection, publicKey, 'confirmed');
        const mint = await getMint(connection, account.mint, 'confirmed');

        return new ReadableTokenAccount(account, mint);
      } catch (error) {
        if (!(error instanceof Error)) throw error;

        if (error instanceof TokenAccountNotFoundError)
          throw new Error('Token account does not exist.');

        if (error.message === PublicKeyErrorMessage.INVALID_PUBLIC_KEY)
          throw new Error('Invalid public key');

        throw error;
      }
    },
    enabled: Boolean(publicKeyString),
    staleTime: 5 * 60 * 1000, // 5 mins
    gcTime: 5 * 60 * 1000, // 5 mins
    refetchOnMount: false,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return query;
};
