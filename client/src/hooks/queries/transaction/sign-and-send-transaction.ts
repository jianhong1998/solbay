'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  BlockhashWithExpiryBlockHeight,
  Commitment,
  SendTransactionError,
  VersionedTransaction,
} from '@solana/web3.js';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { ErrorHandler } from '@/utils/shared/error-handler';
import { TransactionUtil } from '@/utils/transaction.util';

type ISignAndSendTransactionParams = {
  transaction: VersionedTransaction;
  latestBlockhash: BlockhashWithExpiryBlockHeight;
  commitment?: Commitment;
};

type ISignAndSendTransactionResult = {
  transactionId: string;
};

export const useSignAndSendTransaction = (params: {
  actionKey: string;
  skipPreflight?: boolean;
  onSuccess?: () => Promise<void>;
}) => {
  const { connection } = useConnection();
  const { signTransaction } = useWallet();
  const { actionKey, onSuccess, skipPreflight } = params;

  const query = useMutation<
    ISignAndSendTransactionResult,
    Error,
    ISignAndSendTransactionParams
  >({
    mutationKey: ['transaction', 'sign-and-send', actionKey],
    mutationFn: async ({ transaction, latestBlockhash, commitment }) => {
      if (!signTransaction) throw new Error('Wallet is not connected');
      const signedTransaction = await signTransaction(transaction);

      const transactionId = await TransactionUtil.sendAndConfirmTransaction({
        connection,
        transaction: signedTransaction,
        latestBlockhash,
        commitment,
        skipPreflight,
      });
      return { transactionId };
    },
    onSuccess,
    onError: (error) => {
      if (error instanceof SendTransactionError) {
        const { message } = error.transactionError;
        toast.error(message);
        return;
      }

      const errorMessage = ErrorHandler.extractErrorMessage(error);
      toast.error(errorMessage);
    },
  });

  return query;
};
