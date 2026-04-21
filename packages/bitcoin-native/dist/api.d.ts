/**
 * Stacks API client — lightweight wrapper around the Hiro API.
 */
import type { StacksNetwork, BalanceInfo, BlockInfo, NetworkStatus } from './types';
export declare class StacksAPI {
    private network;
    constructor(network?: StacksNetwork);
    /**
     * Get balance for an address
     */
    getBalance(address: string): Promise<BalanceInfo>;
    /**
     * Get current block height
     */
    getBlockHeight(): Promise<number>;
    /**
     * Get detailed block info by height
     */
    getBlock(height: number): Promise<BlockInfo | null>;
    /**
     * Get network status and info
     */
    getNetworkStatus(): Promise<NetworkStatus>;
    /**
     * Call a read-only contract function
     */
    callReadOnly(contractAddress: string, contractName: string, functionName: string, args?: string[], senderAddress?: string): Promise<any>;
    /**
     * Get recent transactions for an address
     */
    getTransactions(address: string, limit?: number): Promise<any[]>;
    /**
     * Get the contract source code
     */
    getContractSource(contractAddress: string, contractName: string): Promise<string | null>;
    /**
     * Get the contract ABI (interface)
     */
    getContractABI(contractAddress: string, contractName: string): Promise<any | null>;
    /**
     * Get STX price from a public API (CoinGecko)
     */
    getSTXPrice(): Promise<{
        usd: number;
        btc: number;
    } | null>;
}
