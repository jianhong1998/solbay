'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { GeneralErrorMessage } from '@/constants/error.constant';
import { useServerAxios } from '@/hooks/axios/server-axios-client';
import { ErrorHandler } from '@/utils/shared/error-handler';

import { getQueryKeyForGetAllBuyerOrder } from '../order/get-order';

type IUpdatePaymentInfoParams = {
  orderIds: string[];
};

type IUpdatePaymentInfoResult = {
  orderIds: string[];
};

export const useUpdatePaymentInfo = () => {
  const serverAxios = useServerAxios();
  const { publicKey } = useWallet();
  const publicKeyString = publicKey?.toBase58() ?? null;
  const queryClient = useQueryClient();

  const query = useMutation<
    IUpdatePaymentInfoResult,
    Error,
    IUpdatePaymentInfoParams
  >({
    mutationKey: ['payment', 'update-paument-info'],
    mutationFn: async ({ orderIds }) => {
      const url = '/payment';
      const body = { orderIds };

      const res = await serverAxios.put<{ orderIds: string[] }>(url, body);

      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getQueryKeyForGetAllBuyerOrder(publicKeyString),
      });

      toast.success('Successfully updated payment info for orders');
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

  return query;
};
