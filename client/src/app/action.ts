'use server';

import { SERVER_URL } from '@/constants/server.constant';

export const getBaseUrl = async (): Promise<{ baseUrl: string }> => {
  const baseUrl = SERVER_URL?.trim() ?? '';
  const validProtocol = new Set<string>(['http:', 'https:']);

  try {
    const parsedUrl = new URL(baseUrl);
    const protocol = parsedUrl.protocol;

    if (!validProtocol.has(protocol)) throw new Error();

    let finalUrl = parsedUrl.href;
    if (finalUrl.endsWith('/')) {
      finalUrl.slice(0, finalUrl.length - 1);
    }

    return {
      baseUrl: finalUrl,
    };
  } catch (_error) {
    throw new Error(`Invalid base URL: ${baseUrl}`);
  }
};
