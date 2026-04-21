"use strict";
/**
 * Network configuration and utilities for Stacks.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkUtils = exports.NetworkConfig = exports.NETWORKS = void 0;
exports.NETWORKS = {
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
class NetworkConfig {
    constructor(network = 'mainnet') {
        this.network = network;
        this.definition = exports.NETWORKS[network];
    }
    getApiBase() {
        return this.definition.apiBase;
    }
    getExplorerBase() {
        return this.definition.explorerBase;
    }
    getBroadcastEndpoint() {
        return this.definition.broadcastEndpoint;
    }
    isMainnet() {
        return this.definition.isMainnet;
    }
    getChainId() {
        return this.definition.chainId;
    }
    getName() {
        return this.definition.name;
    }
    /**
     * Build a full API URL from a path
     */
    apiUrl(path) {
        const base = this.definition.apiBase.replace(/\/$/, '');
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${base}${cleanPath}`;
    }
    /**
     * Build an explorer URL for a transaction
     */
    txExplorerUrl(txId) {
        const chain = this.network === 'mainnet' ? 'mainnet' : 'testnet';
        return `${this.definition.explorerBase}/txid/${txId}?chain=${chain}`;
    }
    /**
     * Build an explorer URL for an address
     */
    addressExplorerUrl(address) {
        const chain = this.network === 'mainnet' ? 'mainnet' : 'testnet';
        return `${this.definition.explorerBase}/address/${address}?chain=${chain}`;
    }
    /**
     * Build an explorer URL for a block
     */
    blockExplorerUrl(blockHash) {
        const chain = this.network === 'mainnet' ? 'mainnet' : 'testnet';
        return `${this.definition.explorerBase}/block/${blockHash}?chain=${chain}`;
    }
}
exports.NetworkConfig = NetworkConfig;
class NetworkUtils {
    /**
     * Get the correct network based on a Stacks address prefix
     */
    static detectNetwork(address) {
        if (address.startsWith('SP'))
            return 'mainnet';
        if (address.startsWith('ST') || address.startsWith('SM'))
            return 'testnet';
        return 'mainnet';
    }
    /**
     * Check if a Hiro API endpoint is reachable
     */
    static async isOnline(network = 'mainnet') {
        try {
            const config = new NetworkConfig(network);
            const response = await fetch(`${config.getApiBase()}/v2/info`, {
                method: 'GET',
                signal: AbortSignal.timeout(5000),
            });
            return response.ok;
        }
        catch {
            return false;
        }
    }
    /**
     * Get the current chain tip (latest block info)
     */
    static async getChainTip(network = 'mainnet') {
        try {
            const config = new NetworkConfig(network);
            const response = await fetch(`${config.getApiBase()}/v2/info`);
            if (!response.ok)
                return null;
            const data = await response.json();
            return {
                height: data.stacks_tip_height,
                hash: data.stacks_tip,
            };
        }
        catch {
            return null;
        }
    }
    /**
     * Get all available network configurations
     */
    static getAllNetworks() {
        return { ...exports.NETWORKS };
    }
}
exports.NetworkUtils = NetworkUtils;
