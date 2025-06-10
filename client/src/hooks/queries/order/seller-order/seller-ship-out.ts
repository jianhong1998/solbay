'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { useServerAxios } from '@/hooks/axios/server-axios-client';
import { DateTimeHelper } from '@/utils/shared/date-time-helper';
import { ErrorHandler } from '@/utils/shared/error-handler';
import { TransactionUtil } from '@/utils/transaction.util';

import {
  getQueryKeyForGetAllBuyerOrder,
  getQueryKeyForGetAllSellerOrder,
  getQueryKeyForGetOrderDetails,
} from '../get-order';

type IUpdateOrderLogisticTrackingInfoRequestBody = {
  logisticTrackingInfo: {
    estimatedDeliverDate: string;
    logisticProvider: string;
    trackingCode: string;
    trackingUrl: string | null;
  };
};

type IUpdateOrderLogisticTrackingInfoResponse = {
  additionalMessage: string | null;
  transactionData: {
    transaction: string;
    latestBlockhash: string;
    lastValidBlockHeight: number;
  } | null;
};

type IUseSellerShipOutResult = {
  transactionId: string | null;
};

export type IUseSellerShipOutParams = {
  orderId: string;
  logisticTrackingInfo: {
    estimatedDeliverDate: Date;
    logisticProvider: string;
    trackingCode: string;
    trackingUrl: string | null;
  };
};

const getQueryKeyForSellerShipOut = (publicKey: string | null) => {
  return ['order', 'status-update', 'delivery-in-progress', { publicKey }];
};

export const useSellerShipOut = () => {
  const serverAxios = useServerAxios();
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const publicKeyString = publicKey?.toBase58() ?? null;

  const queryClient = useQueryClient();

  return useMutation<IUseSellerShipOutResult, Error, IUseSellerShipOutParams>({
    mutationKey: getQueryKeyForSellerShipOut(publicKeyString),
    mutationFn: async ({ orderId, logisticTrackingInfo }) => {
      if (!signTransaction) throw new Error('Wallet is not connected');

      const {
        estimatedDeliverDate,
        logisticProvider,
        trackingCode,
        trackingUrl,
      } = logisticTrackingInfo;

      const date = DateTimeHelper.format(estimatedDeliverDate, 'yyyy-MM-dd');

      const url = `/order/${orderId}/delivery-in-progress`;
      const body: IUpdateOrderLogisticTrackingInfoRequestBody = {
        logisticTrackingInfo: {
          estimatedDeliverDate: date,
          logisticProvider,
          trackingCode,
          trackingUrl,
        },
      };

      const updateOrderLogisticTrackingInfoRes =
        await serverAxios.patch<IUpdateOrderLogisticTrackingInfoResponse>(
          url,
          body,
        );

      const { additionalMessage, transactionData } =
        updateOrderLogisticTrackingInfoRes.data;

      if (additionalMessage) {
        toast.custom(additionalMessage);
      }

      if (!transactionData) {
        return { transactionId: null };
      }

      const {
        lastValidBlockHeight,
        latestBlockhash,
        transaction: serializedTransaction,
      } = transactionData;

      const transaction = TransactionUtil.deserializeTransaction(
        serializedTransaction,
      );
      const signedTransaction = await signTransaction(transaction);
      const transactionId = await TransactionUtil.sendAndConfirmTransaction({
        transaction: signedTransaction,
        connection,
        latestBlockhash: {
          blockhash: latestBlockhash,
          lastValidBlockHeight,
        },
        commitment: 'confirmed',
      });

      return { transactionId };
    },
    onSuccess: async (_result, { orderId }) => {
      toast.success('Successfully mark order as delivery in progress');
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getQueryKeyForGetOrderDetails(publicKeyString, orderId),
        }),
        queryClient.invalidateQueries({
          queryKey: getQueryKeyForGetAllSellerOrder(publicKeyString),
        }),
        queryClient.invalidateQueries({
          queryKey: getQueryKeyForGetAllBuyerOrder(publicKeyString),
        }),
      ]);
    },
    onError: (error) => {
      const message = ErrorHandler.extractErrorMessage(error);
      toast.error(message);
    },
    retry: false,
  });
};
