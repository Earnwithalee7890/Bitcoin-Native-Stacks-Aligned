/**
 * Network configuration and utilities for Stacks.
 */

import type { StacksNetwork } from './types';

export interface NetworkDefinition {
  name: string;
  chainId: number;
  apiBase: string;
  explorerBase: string;
  broadcastEndpoint: string;
  isMainnet: boolean;
}

export const NETWORKS: Record<StacksNetwork, NetworkDefinition> = {
  mainnet: {
    name: 'Stacks Mainnet',
    chainId: 1,
    apiBase: 'https://api.mainnet.hiro.so',
    explorerBase: 'https://explorer.hiro.so',
    broadcastEndpoint: 'https://api.mainnet.hiro.so/v2/transactions',
    isMainnet: true,
  },
  testnet: {
    name: 'Stacks Testnet',
    chainId: 2147483648,
    apiBase: 'https://api.testnet.hiro.so',
    explorerBase: 'https://explorer.hiro.so',
    broadcastEndpoint: 'https://api.testnet.hiro.so/v2/transactions',
    isMainnet: false,
  },
  devnet: {
    name: 'Stacks Devnet',
    chainId: 2147483648,
    apiBase: 'http://localhost:3999',
    explorerBase: 'http://localhost:8000',
    broadcastEndpoint: 'http://localhost:3999/v2/transactions',
    isMainnet: false,
  },
};

export class NetworkConfig {
  private network: StacksNetwork;
  private definition: NetworkDefinition;

  constructor(network: StacksNetwork = 'mainnet') {
    this.network = network;
    this.definition = NETWORKS[network];
  }

  getApiBase(): string {
    return this.definition.apiBase;
  }

  getExplorerBase(): string {
    return this.definition.explorerBase;
  }

  getBroadcastEndpoint(): string {
    return this.definition.broadcastEndpoint;
  }

  isMainnet(): boolean {
    return this.definition.isMainnet;
  }

  getChainId(): number {
    return this.definition.chainId;
  }

  getName(): string {
    return this.definition.name;
  }

  /**
   * Build a full API URL from a path
   */
  apiUrl(path: string): string {
    const base = this.definition.apiBase.replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${cleanPath}`;
  }

  /**
   * Build an explorer URL for a transaction
   */
  txExplorerUrl(txId: string): string {
    const chain = this.network === 'mainnet' ? 'mainnet' : 'testnet';
    return `${this.definition.explorerBase}/txid/${txId}?chain=${chain}`;
  }

  /**
   * Build an explorer URL for an address
   */
  addressExplorerUrl(address: string): string {
    const chain = this.network === 'mainnet' ? 'mainnet' : 'testnet';
    return `${this.definition.explorerBase}/address/${address}?chain=${chain}`;
  }

  /**
   * Build an explorer URL for a block
   */
  blockExplorerUrl(blockHash: string): string {
    const chain = this.network === 'mainnet' ? 'mainnet' : 'testnet';
    return `${this.definition.explorerBase}/block/${blockHash}?chain=${chain}`;
  }
}

export class NetworkUtils {
  /**
   * Get the correct network based on a Stacks address prefix
   */
  static detectNetwork(address: string): StacksNetwork {
    if (address.startsWith('SP')) return 'mainnet';
    if (address.startsWith('ST') || address.startsWith('SM')) return 'testnet';
    return 'mainnet';
  }

  /**
   * Check if a Hiro API endpoint is reachable
   */
  static async isOnline(network: StacksNetwork = 'mainnet'): Promise<boolean> {
    try {
      const config = new NetworkConfig(network);
      const response = await fetch(`${config.getApiBase()}/v2/info`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Get the current chain tip (latest block info)
   */
  static async getChainTip(network: StacksNetwork = 'mainnet'): Promise<{ height: number; hash: string } | null> {
    try {
      const config = new NetworkConfig(network);
      const response = await fetch(`${config.getApiBase()}/v2/info`);
      if (!response.ok) return null;
      const data: any = await response.json();
      return {
        height: data.stacks_tip_height,
        hash: data.stacks_tip,
      };
    } catch {
      return null;
    }
  }

  /**
   * Get all available network configurations
   */
  static getAllNetworks(): Record<StacksNetwork, NetworkDefinition> {
    return { ...NETWORKS };
  }
}
