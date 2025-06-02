import { TokenAccountNotFoundError, TokenError } from '@solana/spl-token';
import { SendTransactionError } from '@solana/web3.js';
import axios, { AxiosError } from 'axios';

import { GeneralErrorMessage } from '@/constants/error.constant';

type PrimitiveDataType = boolean | number | bigint | symbol;

export class ErrorHandler {
  private constructor() {}

  public static extractErrorMessage(error: unknown): string {
    if (!error) {
      return GeneralErrorMessage.SOMETHING_WENT_WRONG;
    }

    if (this.isDataPrimitiveData(error)) {
      return this.getPrimitiveMessage(error);
    }

    if (axios.isAxiosError(error)) {
      return (
        this.extractErrorMessageFromAxiosError(error) ??
        GeneralErrorMessage.SOMETHING_WENT_WRONG
      );
    }

    if (error instanceof SendTransactionError) {
      return this.getSendTransactionErrorMessage(error);
    }

    if (error instanceof TokenError) {
      return this.getTokenErrorMessage(error);
    }

    if (error instanceof Error) {
      return error.message;
    }

    return GeneralErrorMessage.SOMETHING_WENT_WRONG;
  }

  public static extractStatusCodeFromError(
    error: unknown,
  ): number | 'ERR_NETWORK' | null {
    if (!error || !axios.isAxiosError(error)) {
      return null;
    }

    if (!error.response?.status && error.code === 'ERR_NETWORK') {
      return error.code;
    }

    return error.response?.status ?? null;
  }

  private static extractErrorMessageFromAxiosError(
    error: AxiosError,
  ): string | null {
    if (this.extractStatusCodeFromError(error) === 'ERR_NETWORK') {
      return GeneralErrorMessage.NETWORK_ERROR;
    }

    const data = error.response?.data;

    if (!data) {
      return error.message;
    }

    if (typeof data === 'string') {
      return data;
    }

    if (this.isDataPrimitiveData(data)) {
      return this.getPrimitiveMessage(data);
    }

    if (typeof data === 'object' && 'message' in data) {
      if (typeof data.message === 'string') {
        return data.message;
      }

      if (typeof data.message === 'object' && Array.isArray(data.message)) {
        return data.message.map((message) => String(message)).join('. ');
      }
    }

    return null;
  }

  private static getPrimitiveMessage(message: PrimitiveDataType): string {
    return String(message);
  }

  private static isDataPrimitiveData(data: unknown): data is PrimitiveDataType {
    return (
      typeof data === 'bigint' ||
      typeof data === 'boolean' ||
      typeof data === 'number' ||
      typeof data === 'symbol'
    );
  }

  private static getTokenErrorMessage(error: TokenError): string {
    if (error instanceof TokenAccountNotFoundError) {
      return 'Token account does not exist!';
    }

    return GeneralErrorMessage.SOMETHING_WENT_WRONG;
  }

  private static getSendTransactionErrorMessage(
    error: SendTransactionError,
  ): string {
    const message = error.transactionError.message;

    if (
      message
        .toLocaleLowerCase()
        .includes(
          'attempt to debit an account but found no record of a prior credit',
        )
    ) {
      return 'Account does not have enough SOL';
    }

    return message;
  }
}
