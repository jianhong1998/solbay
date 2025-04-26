'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { useServerAxios } from '@/hooks/axios/server-axios-client';
import { useProgram } from '@/hooks/program';
import { useLogger } from '@/utils/shared/logger';
import { TransactionUtil } from '@/utils/transaction.util';

export const useLogin = () => {
  const { connection } = useConnection();
  const program = useProgram();
  const { publicKey, signTransaction, disconnect } = useWallet();
  const serverAxios = useServerAxios();
  const logger = useLogger();

  return useMutation<void, Error, void>({
    mutationKey: ['auth', 'login', { publicKey: publicKey?.toBase58() }],
    mutationFn: async () => {
      if (!publicKey || !signTransaction)
        throw new Error('Wallet is not connected!');

      if (!serverAxios.isInitialized) {
        throw new Error('Is not initialized');
      }

      const loginInstruction = await program.methods
        .login()
        .accounts({
          signer: publicKey,
        })
        .instruction();
      const { transaction } = await TransactionUtil.createTransaction({
        connection,
        instructions: [loginInstruction],
        payerPublicKey: publicKey,
      });

      const signedTransaction = await signTransaction(transaction);

      const serializedTransaction = signedTransaction.serialize();

      await serverAxios.post(`/auth`, {
        transaction: Buffer.from(serializedTransaction).toString('base64'),
        publicKey: publicKey.toBase58(),
      });
    },
    onError: async (error) => {
      if (error.message.toLowerCase() === 'network error') {
        toast.error('Failed to connect with server, please try again later');
        return;
      }

      if (error.message === 'User rejected the request.') {
        toast.error('Failed to sign login transaction');
        await disconnect();
        return;
      }

      logger.log(error.message);
    },
    retryDelay: 0,
    retry: (_count, error) => {
      if (error.message.toLowerCase() === 'is not initialized') return true;

      return false;
    },
  });
};
