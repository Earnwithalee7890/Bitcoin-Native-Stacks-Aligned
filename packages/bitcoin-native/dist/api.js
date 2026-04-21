"use strict";
/**
 * Stacks API client — lightweight wrapper around the Hiro API.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.StacksAPI = void 0;
const network_1 = require("./network");
const converter_1 = require("./converter");
class StacksAPI {
    constructor(network = 'mainnet') {
        this.network = new network_1.NetworkConfig(network);
    }
    /**
     * Get balance for an address
     */
    async getBalance(address) {
        const response = await fetch(this.network.apiUrl(`/extended/v1/address/${address}/balances`));
        if (!response.ok)
            throw new Error(`Failed to fetch balance: ${response.status}`);
        const data = await response.json();
        const fungibleTokens = Object.entries(data.fungible_tokens || {}).map(([id, info]) => ({
            tokenId: id,
            balance: parseInt(info.balance || '0', 10),
            totalSent: parseInt(info.total_sent || '0', 10),
            totalReceived: parseInt(info.total_received || '0', 10),
        }));
        const nonFungibleTokens = Object.entries(data.non_fungible_tokens || {}).map(([id, info]) => ({
            assetIdentifier: id,
            count: info.count || 0,
            ids: info.ids || [],
        }));
        return {
            stx: converter_1.STXConverter.toSTX(parseInt(data.stx?.balance || '0', 10)),
            stxLocked: converter_1.STXConverter.toSTX(parseInt(data.stx?.locked || '0', 10)),
            burnchainBalance: parseInt(data.stx?.burnchain_balance || '0', 10),
            fungibleTokens,
            nonFungibleTokens,
        };
    }
    /**
     * Get current block height
     */
    async getBlockHeight() {
        const response = await fetch(this.network.apiUrl('/v2/info'));
        if (!response.ok)
            throw new Error(`Failed to fetch block height: ${response.status}`);
        const data = await response.json();
        return data.stacks_tip_height;
    }
    /**
     * Get detailed block info by height
     */
    async getBlock(height) {
        try {
            const response = await fetch(this.network.apiUrl(`/extended/v1/block/by_height/${height}`));
            if (!response.ok)
                return null;
            const data = await response.json();
            return {
                height: data.height,
                hash: data.hash,
                burnBlockTime: data.burn_block_time,
                burnBlockHash: data.burn_block_hash,
                parentBlockHash: data.parent_block_hash,
                txCount: data.txs?.length || 0,
                microblockCount: data.microblocks_accepted?.length || 0,
            };
        }
        catch {
            return null;
        }
    }
    /**
     * Get network status and info
     */
    async getNetworkStatus() {
        const response = await fetch(this.network.apiUrl('/v2/info'));
        if (!response.ok)
            throw new Error(`Failed to fetch network info: ${response.status}`);
        const data = await response.json();
        return {
            online: true,
            currentBlock: data.stacks_tip_height,
            networkId: data.network_id,
            chainTip: data.stacks_tip,
            peerCount: data.peer_count || 0,
            mempoolSize: data.unanchored_tip ? 1 : 0,
        };
    }
    /**
     * Call a read-only contract function
     */
    async callReadOnly(contractAddress, contractName, functionName, args = [], senderAddress) {
        const sender = senderAddress || contractAddress;
        const response = await fetch(this.network.apiUrl(`/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sender: sender,
                arguments: args,
            }),
        });
        if (!response.ok)
            throw new Error(`Read-only call failed: ${response.status}`);
        return response.json();
    }
    /**
     * Get recent transactions for an address
     */
    async getTransactions(address, limit = 20) {
        const response = await fetch(this.network.apiUrl(`/extended/v1/address/${address}/transactions?limit=${limit}`));
        if (!response.ok)
            return [];
        const data = await response.json();
        return data.results || [];
    }
    /**
     * Get the contract source code
     */
    async getContractSource(contractAddress, contractName) {
        try {
            const response = await fetch(this.network.apiUrl(`/v2/contracts/source/${contractAddress}/${contractName}`));
            if (!response.ok)
                return null;
            const data = await response.json();
            return data.source;
        }
        catch {
            return null;
        }
    }
    /**
     * Get the contract ABI (interface)
     */
    async getContractABI(contractAddress, contractName) {
        try {
            const response = await fetch(this.network.apiUrl(`/v2/contracts/interface/${contractAddress}/${contractName}`));
            if (!response.ok)
                return null;
            return response.json();
        }
        catch {
            return null;
        }
    }
    /**
     * Get STX price from a public API (CoinGecko)
     */
    async getSTXPrice() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=blockstack&vs_currencies=usd,btc');
            if (!response.ok)
                return null;
            const data = await response.json();
            return {
                usd: data.blockstack?.usd || 0,
                btc: data.blockstack?.btc || 0,
            };
        }
        catch {
            return null;
        }
    }
}
exports.StacksAPI = StacksAPI;
