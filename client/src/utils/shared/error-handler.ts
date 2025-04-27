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

    if (error instanceof Error) {
      return error.message;
    }

    return GeneralErrorMessage.SOMETHING_WENT_WRONG;
  }

  public static extractStatusCodeFromError(error: unknown): number | null {
    if (!error || !axios.isAxiosError(error)) {
      return null;
    }

    return error.response?.status ?? null;
  }

  private static extractErrorMessageFromAxiosError(
    error: AxiosError,
  ): string | null {
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

    if (
      typeof data === 'object' &&
      'message' in data &&
      typeof data.message === 'string'
    ) {
      return data.message;
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
}
