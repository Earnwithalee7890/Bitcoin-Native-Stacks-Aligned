/**
 * Transaction utilities for Stacks.
 */
import type { TransactionResult, MempoolTransaction, StacksNetwork } from './types';
export declare class TransactionUtils {
    /**
     * Format a transaction ID for display
     */
    static formatTxId(txId: string, prefixLen?: number, suffixLen?: number): string;
    /**
     * Ensure a txId has the 0x prefix
     */
    static normalizeTxId(txId: string): string;
    /**
     * Get the explorer URL for a transaction
     */
    static explorerUrl(txId: string, network?: StacksNetwork): string;
    /**
     * Calculate the relative time from a burn block timestamp
     */
    static relativeTime(burnBlockTime: number): string;
    /**
     * Map a raw API tx_status to a friendly status
     */
    static mapStatus(apiStatus: string): TransactionResult['status'];
    /**
     * Get the status emoji for display
     */
    static statusEmoji(status: TransactionResult['status']): string;
    /**
     * Get the status color for UI display
     */
    static statusColor(status: TransactionResult['status']): string;
    /**
     * Classify a transaction type into a human-readable label
     */
    static classifyTxType(txType: string): string;
}
export declare class TxStatusChecker {
    private network;
    constructor(network?: StacksNetwork);
    /**
     * Get the current status of a transaction
     */
    getStatus(txId: string): Promise<TransactionResult | null>;
    /**
     * Wait for a transaction to be confirmed (polls every interval_ms)
     */
    waitForConfirmation(txId: string, timeoutMs?: number, intervalMs?: number): Promise<TransactionResult | null>;
    /**
     * Get pending mempool transactions for an address
     */
    getMempoolTransactions(address: string): Promise<MempoolTransaction[]>;
}
