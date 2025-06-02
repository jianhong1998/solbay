'use client';

import {} from '@solana/spl-token';
import { useWallet } from '@solana/wallet-adapter-react';
import { BlockhashWithExpiryBlockHeight } from '@solana/web3.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { GeneralErrorMessage } from '@/constants/error.constant';
import { useServerAxios } from '@/hooks/axios/server-axios-client';
import { ErrorHandler } from '@/utils/shared/error-handler';
import { TransactionUtil } from '@/utils/transaction.util';

import { useSignAndSendTransaction } from '../transaction/sign-and-send-transaction';

type IInitDummyUsdcAssociatedTokenAccountRes = {
  transaction: string;
  latestBlockhash: BlockhashWithExpiryBlockHeight;
};

export const useInitDummyUsdcAssociatedTokenAccount = () => {
  const serverAxios = useServerAxios();
  const { publicKey } = useWallet();
  const publicKeyString = publicKey?.toBase58() ?? null;
  const { mutateAsync: signAndSendTransactionFn } = useSignAndSendTransaction({
    actionKey: 'InitDummyUsdcAssociatedTokenAccount',
  });
  const queryClient = useQueryClient();

  const query = useMutation<{ transactionId: string }, Error>({
    mutationKey: [
      'dummy-usdc-account',
      'create',
      { publicKey: publicKeyString },
    ],
    mutationFn: async () => {
      if (!publicKeyString) throw new Error('Wallet is not connected!');

      const url = '/internal/dummy-usdc-account';
      const body = { owner: publicKeyString };

      const res =
        await serverAxios.post<IInitDummyUsdcAssociatedTokenAccountRes>(
          url,
          body,
        );

      const { latestBlockhash, transaction: serializedTransaction } = res.data;
      const transaction = TransactionUtil.deserializeTransaction(
        serializedTransaction,
      );

      const result = await signAndSendTransactionFn({
        transaction,
        latestBlockhash,
        commitment: 'confirmed',
      });

      return result;
    },
    onSuccess: async (_data) => {
      await queryClient.invalidateQueries({
        queryKey: ['dummy-usdc-account', 'get', { publicKey: publicKeyString }],
      });
      toast.success('Associated token account for dummy USDC is initialized!');
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
  });

  return query;
};
