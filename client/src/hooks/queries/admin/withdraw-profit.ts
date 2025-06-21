'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { useServerAxios } from '@/hooks/axios/server-axios-client';
import { ErrorHandler } from '@/utils/shared/error-handler';

import { getQueryKeyForGetTokenAccountQuery } from '../token-account/get-token-account';

export type IWithdrawProfitParams = {
  amount: number;
};

export type IWithdrawProfitResponse = {
  transactionId: string;
  url: string;
};

export const getQueryKeyForWithdrawProfit = () => [
  'escrow-operation-account',
  'withdraw-profit',
];

export const useWithdrawProfit = (escrowOperationAccountPublicKey: string) => {
  const serverAxios = useServerAxios();
  const queryClient = useQueryClient();

  const escrowOperationAccountQueryKey = getQueryKeyForGetTokenAccountQuery(
    escrowOperationAccountPublicKey,
  );

  return useMutation<IWithdrawProfitResponse, Error, IWithdrawProfitParams>({
    mutationKey: getQueryKeyForWithdrawProfit(),
    mutationFn: async ({ amount }) => {
      const url = '/escrow/withdraw-profit';
      const data = {
        amount,
      };
      const res = await serverAxios.post<IWithdrawProfitResponse>(url, data);

      return res.data;
    },
    onSuccess: async () => {
      toast.success('Withdraw profit successfully!');
      await queryClient.invalidateQueries({
        queryKey: escrowOperationAccountQueryKey,
      });
    },
    onError: (error) => {
      const message = ErrorHandler.extractErrorMessage(error);
      toast.error(message);
    },
  });
};
