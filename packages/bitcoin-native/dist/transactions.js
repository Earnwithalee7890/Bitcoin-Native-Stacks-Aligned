"use strict";
/**
 * Transaction utilities for Stacks.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxStatusChecker = exports.TransactionUtils = void 0;
const network_1 = require("./network");
class TransactionUtils {
    /**
     * Format a transaction ID for display
     */
    static formatTxId(txId, prefixLen = 8, suffixLen = 6) {
        const clean = txId.startsWith('0x') ? txId : `0x${txId}`;
        if (clean.length <= prefixLen + suffixLen + 3)
            return clean;
        return `${clean.slice(0, prefixLen)}...${clean.slice(-suffixLen)}`;
    }
    /**
     * Ensure a txId has the 0x prefix
     */
    static normalizeTxId(txId) {
        return txId.startsWith('0x') ? txId : `0x${txId}`;
    }
    /**
     * Get the explorer URL for a transaction
     */
    static explorerUrl(txId, network = 'mainnet') {
        const config = new network_1.NetworkConfig(network);
        return config.txExplorerUrl(TransactionUtils.normalizeTxId(txId));
    }
    /**
     * Calculate the relative time from a burn block timestamp
     */
    static relativeTime(burnBlockTime) {
        const now = Math.floor(Date.now() / 1000);
        const diff = now - burnBlockTime;
        if (diff < 0)
            return 'just now';
        if (diff < 60)
            return `${diff}s ago`;
        if (diff < 3600)
            return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400)
            return `${Math.floor(diff / 3600)}h ago`;
        if (diff < 2592000)
            return `${Math.floor(diff / 86400)}d ago`;
        return `${Math.floor(diff / 2592000)}mo ago`;
    }
    /**
     * Map a raw API tx_status to a friendly status
     */
    static mapStatus(apiStatus) {
        switch (apiStatus) {
            case 'success': return 'success';
            case 'abort_by_response':
            case 'abort_by_post_condition': return 'failed';
            case 'dropped_replace_by_fee':
            case 'dropped_replace_across_fork':
            case 'dropped_too_expensive':
            case 'dropped_stale_garbage_collect': return 'dropped';
            default: return 'pending';
        }
    }
    /**
     * Get the status emoji for display
     */
    static statusEmoji(status) {
        switch (status) {
            case 'success': return '✅';
            case 'pending': return '⏳';
            case 'failed': return '❌';
            case 'dropped': return '🗑️';
        }
    }
    /**
     * Get the status color for UI display
     */
    static statusColor(status) {
        switch (status) {
            case 'success': return '#22C55E';
            case 'pending': return '#F59E0B';
            case 'failed': return '#EF4444';
            case 'dropped': return '#6B7280';
        }
    }
    /**
     * Classify a transaction type into a human-readable label
     */
    static classifyTxType(txType) {
        const types = {
            'token_transfer': 'STX Transfer',
            'contract_call': 'Contract Call',
            'smart_contract': 'Contract Deploy',
            'poison_microblock': 'Poison Microblock',
            'coinbase': 'Coinbase',
            'tenure_change': 'Tenure Change',
        };
        return types[txType] || txType.replace(/_/g, ' ');
    }
}
exports.TransactionUtils = TransactionUtils;
class TxStatusChecker {
    constructor(network = 'mainnet') {
        this.network = new network_1.NetworkConfig(network);
    }
    /**
     * Get the current status of a transaction
     */
    async getStatus(txId) {
        try {
            const normalizedId = TransactionUtils.normalizeTxId(txId);
            const response = await fetch(this.network.apiUrl(`/extended/v1/tx/${normalizedId}`));
            if (!response.ok)
                return null;
            const data = await response.json();
            return {
                txId: data.tx_id,
                status: TransactionUtils.mapStatus(data.tx_status),
                blockHeight: data.block_height,
                blockHash: data.block_hash,
                burnBlockTime: data.burn_block_time,
                fee: data.fee_rate ? parseInt(data.fee_rate, 10) : undefined,
                nonce: data.nonce,
                senderAddress: data.sender_address,
                rawResult: data.tx_result?.repr,
            };
        }
        catch {
            return null;
        }
    }
    /**
     * Wait for a transaction to be confirmed (polls every interval_ms)
     */
    async waitForConfirmation(txId, timeoutMs = 120000, intervalMs = 5000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeoutMs) {
            const result = await this.getStatus(txId);
            if (result && result.status !== 'pending') {
                return result;
            }
            await new Promise(resolve => setTimeout(resolve, intervalMs));
        }
        return null;
    }
    /**
     * Get pending mempool transactions for an address
     */
    async getMempoolTransactions(address) {
        try {
            const response = await fetch(this.network.apiUrl(`/extended/v1/tx/mempool?sender_address=${address}&limit=20`));
            if (!response.ok)
                return [];
            const data = await response.json();
            return data.results.map((tx) => ({
                txId: tx.tx_id,
                txType: tx.tx_type,
                fee: parseInt(tx.fee_rate || '0', 10),
                nonce: tx.nonce,
                senderAddress: tx.sender_address,
                receiptTime: tx.receipt_time,
            }));
        }
        catch {
            return [];
        }
    }
}
exports.TxStatusChecker = TxStatusChecker;
