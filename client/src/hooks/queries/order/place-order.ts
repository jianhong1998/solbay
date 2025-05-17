import { useWallet } from '@solana/wallet-adapter-react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { ILogisticInfoFormData } from '@/components/form/checkout-delivery-form/logistic-info-form-data.type';
import { GeneralErrorMessage } from '@/constants/error.constant';
import { OrderStatus } from '@/enums/order/order-status.constant';
import { useServerAxios } from '@/hooks/axios/server-axios-client';
import { ErrorHandler } from '@/utils/shared/error-handler';

type IPlaceOrderParams = {
  productQuantities: Array<{ productId: string; quantity: number }>;
  logisticInfo: ILogisticInfoFormData;
};

type IPlaceOrderRes = {
  transaction: string;
  orders: Array<{
    uuid: string;
    quantity: number;
    totalAmountInMicroUsdc: number;
    status: OrderStatus;
  }>;
};

export const usePlaceOrder = () => {
  const serverAxios = useServerAxios();
  const { publicKey } = useWallet();
  const publicKeyString = publicKey?.toBase58() ?? null;

  const query = useMutation<IPlaceOrderRes, Error, IPlaceOrderParams>({
    mutationKey: ['order', 'place-order', { publicKey: publicKeyString }],
    mutationFn: async (params: IPlaceOrderParams) => {
      const url = '/order';
      const reqBody = {
        ...params,
      };

      if (!reqBody.logisticInfo.streetLine2?.trim().length) {
        reqBody.logisticInfo.streetLine2 = null;
      }
      if (!reqBody.logisticInfo.streetLine3?.trim().length) {
        reqBody.logisticInfo.streetLine3 = null;
      }

      const res = await serverAxios.post<IPlaceOrderRes>(url, params);

      return res.data;
    },
    onSuccess: () => {
      toast.loading('Checkout successfully. Please pay to complete order.');
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
