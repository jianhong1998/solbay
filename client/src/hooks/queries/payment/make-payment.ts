'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { BlockhashWithExpiryBlockHeight } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';

import { useServerAxios } from '@/hooks/axios/server-axios-client';
import { TransactionUtil } from '@/utils/transaction.util';

export type IMakePaymentResponse = {
  transaction: string;
  latestBlockhash: BlockhashWithExpiryBlockHeight;
};

export type IMakePaymentResult = {
  transactionId: string;
};

export const useMakePayment = (orderIds: string[]) => {
  const serverAxios = useServerAxios();
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const publicKeyString = publicKey?.toBase58() ?? null;

  const queryKey = [
    'payment',
    'make-payment',
    { publicKey: publicKeyString, orderIds },
  ];

  const query = useQuery<IMakePaymentResult, Error>({
    queryKey,
    enabled:
      Boolean(signTransaction) &&
      serverAxios.isInitialized &&
      Boolean(publicKey),
    retry: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: async () => {
      if (!signTransaction) throw new Error('Wallet is not connected!');

      const generateTransactionUrl = '/payment';
      const body = {
        orderIds,
      };

      const {
        data: { latestBlockhash, transaction: serializedTransaction },
      } = await serverAxios.post<IMakePaymentResponse>(
        generateTransactionUrl,
        body,
      );

      const transaction = TransactionUtil.deserializeTransaction(
        serializedTransaction,
      );
      const signedTransaction = await signTransaction(transaction);

      const transactionId = await TransactionUtil.sendAndConfirmTransaction({
        transaction: signedTransaction,
        connection,
        latestBlockhash,
        commitment: 'confirmed',
      });

      return { transactionId };
    },
  });

  return query;
};
