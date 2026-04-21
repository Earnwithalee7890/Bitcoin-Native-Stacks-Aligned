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
export declare const NETWORKS: Record<StacksNetwork, NetworkDefinition>;
export declare class NetworkConfig {
    private network;
    private definition;
    constructor(network?: StacksNetwork);
    getApiBase(): string;
    getExplorerBase(): string;
    getBroadcastEndpoint(): string;
    isMainnet(): boolean;
    getChainId(): number;
    getName(): string;
    /**
     * Build a full API URL from a path
     */
    apiUrl(path: string): string;
    /**
     * Build an explorer URL for a transaction
     */
    txExplorerUrl(txId: string): string;
    /**
     * Build an explorer URL for an address
     */
    addressExplorerUrl(address: string): string;
    /**
     * Build an explorer URL for a block
     */
    blockExplorerUrl(blockHash: string): string;
}
export declare class NetworkUtils {
    /**
     * Get the correct network based on a Stacks address prefix
     */
    static detectNetwork(address: string): StacksNetwork;
    /**
     * Check if a Hiro API endpoint is reachable
     */
    static isOnline(network?: StacksNetwork): Promise<boolean>;
    /**
     * Get the current chain tip (latest block info)
     */
    static getChainTip(network?: StacksNetwork): Promise<{
        height: number;
        hash: string;
    } | null>;
    /**
     * Get all available network configurations
     */
    static getAllNetworks(): Record<StacksNetwork, NetworkDefinition>;
}
