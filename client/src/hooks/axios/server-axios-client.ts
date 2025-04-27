'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { getBaseUrl } from '@/app/action';

const useServerAxios = () => {
  const [baseUrl, setBaseUrl] = useState<string | null>(null);
  const { publicKey } = useWallet();

  const [isInitialized, setIsInitialized] = useState<boolean>(
    () => baseUrl !== null,
  );

  const axiosInstance = useMemo(() => {
    return axios.create({
      baseURL: baseUrl ?? '',
      withCredentials: true,
      headers: {
        'x-public-key': publicKey?.toBase58() ?? '',
      },
    });
  }, [baseUrl, publicKey]);

  useEffect(() => {
    getBaseUrl()
      .then(({ baseUrl }) => {
        setBaseUrl(baseUrl);
      })
      .catch((_error) =>
        toast.error('Cannot get backend URL, please refresh page again.'),
      );
  }, []);

  useEffect(() => {
    setIsInitialized(baseUrl !== null);
  }, [baseUrl]);

  const { get, post, put, patch, delete: deleteFn } = axiosInstance;

  return {
    get,
    post,
    put,
    patch,
    delete: deleteFn,
    isInitialized,
  };
};

export { useServerAxios };
