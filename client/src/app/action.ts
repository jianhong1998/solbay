'use server';

import { SERVER_URL } from '@/constants/server.constant';

export const getBaseUrl = async (): Promise<{ baseUrl: string }> => {
  const baseUrl = SERVER_URL?.trim() ?? '';

  if (!baseUrl.startsWith('http://') && baseUrl.startsWith('https://'))
    throw new Error(`Invalid base URL: ${baseUrl}`);

  return {
    baseUrl,
  };
};
