'use client';

import { clusterApiUrl } from '@solana/web3.js';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
} from 'react';

import { useLogger } from '@/utils/shared/logger';

export interface Cluster {
  name: string;
  endpoint: string;
  network?: ClusterNetwork;
  active?: boolean;
}

export enum ClusterNetwork {
  Mainnet = 'mainnet-beta',
  Testnet = 'testnet',
  Devnet = 'devnet',
  Custom = 'custom',
}

// By default, we don't configure the mainnet-beta cluster
// The endpoint provided by clusterApiUrl('mainnet-beta') does not allow access from the browser due to CORS restrictions
// To use the mainnet-beta cluster, provide a custom endpoint
export const defaultClusters: Cluster[] = [
  {
    name: 'devnet',
    endpoint: clusterApiUrl('devnet'),
    network: ClusterNetwork.Devnet,
  },
  { name: 'localnet', endpoint: 'http://localhost:8899' },
  {
    name: 'testnet',
    endpoint: clusterApiUrl('testnet'),
    network: ClusterNetwork.Testnet,
  },
  {
    name: 'mainnet',
    // TODO: (Enhancement) This cluster API URL for mainnet will get forbidden error (due to CORS). Need to find an endpoint for production
    endpoint: clusterApiUrl('mainnet-beta'),
    network: ClusterNetwork.Mainnet,
  },
];

const clusterAtom = atomWithStorage<Cluster>(
  'solana-cluster',
  defaultClusters[0],
);
const clustersAtom = atomWithStorage<Cluster[]>(
  'solana-clusters',
  defaultClusters,
);

const activeClustersAtom = atom<Cluster[]>((get) => {
  const clusters = get(clustersAtom);
  const cluster = get(clusterAtom);
  return clusters.map((item) => ({
    ...item,
    active: item.name === cluster.name,
  }));
});

const activeClusterAtom = atom<Cluster>((get) => {
  const clusters = get(activeClustersAtom);

  return clusters.find((item) => item.active) || clusters[0];
});

export interface ClusterProviderContext {
  cluster: Cluster;
  getExplorerUrl(path: string): string;
}

const Context = createContext<ClusterProviderContext>(
  {} as ClusterProviderContext,
);

export function ClusterProvider({
  children,
  defaultClusterName = 'local',
}: {
  children: ReactNode;
  defaultClusterName?: string;
}) {
  const cluster = useAtomValue(activeClusterAtom);
  const clusters = useAtomValue(activeClustersAtom);
  const setCluster = useSetAtom(clusterAtom);
  const logger = useLogger();

  const clusterMap = useMemo(
    () =>
      new Map<string, Cluster>(
        clusters?.map((cluster) => [cluster.name, cluster]),
      ),
    [clusters],
  );

  useEffect(() => {
    if (defaultClusterName === cluster.name) return;

    const newDefaultCluster = clusterMap.get(defaultClusterName);
    if (!newDefaultCluster || newDefaultCluster.name === cluster.name) return;

    setCluster(newDefaultCluster);
  }, [defaultClusterName, cluster, setCluster, clusterMap]);

  useEffect(() => {
    logger.log(`Connecting to cluster: ${cluster.name} @ ${cluster.endpoint}`);
  }, [cluster, logger]);

  const value: ClusterProviderContext = {
    cluster,
    getExplorerUrl: (path: string) =>
      `https://explorer.solana.com/${path}${getClusterUrlParam(cluster)}`,
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useCluster() {
  return useContext(Context);
}

function getClusterUrlParam(cluster: Cluster): string {
  let suffix = '';
  switch (cluster.network) {
    case ClusterNetwork.Devnet:
      suffix = 'devnet';
      break;
    case ClusterNetwork.Mainnet:
      suffix = '';
      break;
    case ClusterNetwork.Testnet:
      suffix = 'testnet';
      break;
    default:
      suffix = `custom&customUrl=${encodeURIComponent(cluster.endpoint)}`;
      break;
  }

  return suffix.length ? `?cluster=${suffix}` : '';
}
