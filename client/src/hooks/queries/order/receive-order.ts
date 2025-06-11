import { useWallet } from '@solana/wallet-adapter-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { useServerAxios } from '@/hooks/axios/server-axios-client';
import { ErrorHandler } from '@/utils/shared/error-handler';
import { TransactionUtil } from '@/utils/transaction.util';

import { useSignAndSendTransaction } from '../transaction/sign-and-send-transaction';
import {
  getQueryKeyForGetAllBuyerOrder,
  getQueryKeyForGetAllSellerOrder,
  getQueryKeyForGetOrderDetails,
} from './get-order';

type IUseReceiveOrderParams = { orderId: string };

type IUseReceiveOrderResult = {};

type IReceiveOrderResponse = {
  transactionData: {
    transaction: string;
    latestBlockhash: string;
    lastValidBlockHeight: number;
  };
};

export const getQueryKeyForReceiveOrder = (publicKey: string | null) => [
  'order',
  'receive',
  { publicKey },
];

export const useReceiveOrder = () => {
  const serverAxios = useServerAxios();
  const { publicKey } = useWallet();
  const publciKeyString = publicKey?.toBase58() ?? null;
  const queryClient = useQueryClient();
  const { mutateAsync: signAndSendTransaction } = useSignAndSendTransaction({
    actionKey: 'Receive Order',
  });

  const query = useMutation<
    IUseReceiveOrderResult,
    Error,
    IUseReceiveOrderParams
  >({
    mutationKey: getQueryKeyForReceiveOrder(publciKeyString),
    mutationFn: async ({ orderId }) => {
      const url = `/order/${orderId}/receive`;

      const res = await serverAxios.patch<IReceiveOrderResponse>(url);
      const {
        transactionData: {
          transaction: serializedTransaction,
          lastValidBlockHeight,
          latestBlockhash,
        },
      } = res.data;

      const deserializedTransaction = TransactionUtil.deserializeTransaction(
        serializedTransaction,
      );

      const { transactionId } = await signAndSendTransaction({
        transaction: deserializedTransaction,
        latestBlockhash: {
          blockhash: latestBlockhash,
          lastValidBlockHeight,
        },
      });

      return { transactionId };
    },
    onSuccess: async (_, { orderId }) => {
      toast.success('Successfully receive order!');

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getQueryKeyForGetAllBuyerOrder(publciKeyString),
        }),
        queryClient.invalidateQueries({
          queryKey: getQueryKeyForGetAllSellerOrder(publciKeyString),
        }),
        queryClient.invalidateQueries({
          queryKey: getQueryKeyForGetOrderDetails(publciKeyString, orderId),
        }),
      ]);
    },
    onError: (error) => {
      const errorMessage = ErrorHandler.extractErrorMessage(error);
      toast.error(errorMessage);
    },
  });

  return query;
};
