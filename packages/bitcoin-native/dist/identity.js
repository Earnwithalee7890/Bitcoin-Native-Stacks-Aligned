"use strict";
/**
 * On-chain identity and builder profile utilities.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuilderProfile = exports.OnChainIdentity = void 0;
const network_1 = require("./network");
const address_1 = require("./address");
class OnChainIdentity {
    constructor(address, network = 'mainnet') {
        this.address = address;
        this.network = new network_1.NetworkConfig(network);
    }
    /**
     * Get the on-chain transaction count for this address
     */
    async getTransactionCount() {
        try {
            const response = await fetch(this.network.apiUrl(`/extended/v1/address/${this.address}/transactions?limit=1`));
            if (!response.ok)
                return 0;
            const data = await response.json();
            return data.total || 0;
        }
        catch {
            return 0;
        }
    }
    /**
     * Get the STX balance in microSTX
     */
    async getBalance() {
        try {
            const response = await fetch(this.network.apiUrl(`/extended/v1/address/${this.address}/stx`));
            if (!response.ok)
                return 0;
            const data = await response.json();
            return parseInt(data.balance || '0', 10);
        }
        catch {
            return 0;
        }
    }
    /**
     * Get contracts deployed by this address
     */
    async getDeployedContracts() {
        try {
            const response = await fetch(this.network.apiUrl(`/extended/v1/address/${this.address}/transactions?limit=50`));
            if (!response.ok)
                return [];
            const data = await response.json();
            return data.results
                .filter((tx) => tx.tx_type === 'smart_contract' && tx.tx_status === 'success')
                .map((tx) => tx.smart_contract?.contract_id)
                .filter(Boolean);
        }
        catch {
            return [];
        }
    }
    /**
     * Get the address used
     */
    getAddress() {
        return this.address;
    }
    /**
     * Get the formatted address for display
     */
    getFormattedAddress() {
        return address_1.AddressValidator.formatAddress(this.address);
    }
}
exports.OnChainIdentity = OnChainIdentity;
class BuilderProfile {
    /**
     * Calculate a builder level based on activity metrics
     */
    static calculateLevel(checkIns, pulses, deployments) {
        const score = checkIns * 10 + pulses * 5 + deployments * 50;
        if (score >= 1000)
            return 'legend';
        if (score >= 500)
            return 'architect';
        if (score >= 200)
            return 'builder';
        if (score >= 50)
            return 'active';
        return 'newcomer';
    }
    /**
     * Calculate a reputation score (0-1000)
     */
    static calculateReputation(params) {
        const { checkIns, pulses, contractDeployments, transactionCount, streak, accountAge, } = params;
        let score = 0;
        score += Math.min(checkIns * 10, 200);
        score += Math.min(pulses * 5, 100);
        score += Math.min(contractDeployments * 50, 200);
        score += Math.min(transactionCount * 2, 150);
        score += Math.min(streak * 15, 200);
        score += Math.min(accountAge, 150);
        return Math.min(score, 1000);
    }
    /**
     * Get the title for a given builder level
     */
    static getLevelTitle(level) {
        const titles = {
            newcomer: '🌱 Newcomer',
            active: '⚡ Active Builder',
            builder: '🔨 Builder',
            architect: '🏗️ Architect',
            legend: '🏆 Legend',
        };
        return titles[level];
    }
    /**
     * Get the color associated with a builder level
     */
    static getLevelColor(level) {
        const colors = {
            newcomer: '#6B7280',
            active: '#3B82F6',
            builder: '#8B5CF6',
            architect: '#F59E0B',
            legend: '#EF4444',
        };
        return colors[level];
    }
    /**
     * Create a full builder score object
     */
    static createScore(address, params) {
        const level = BuilderProfile.calculateLevel(params.checkIns, params.pulses, params.contractDeployments);
        const reputationScore = BuilderProfile.calculateReputation(params);
        return {
            address,
            totalCheckIns: params.checkIns,
            totalPulses: params.pulses,
            lastActive: new Date().toISOString(),
            reputationScore,
            rank: 0,
            streak: params.streak,
            level,
        };
    }
}
exports.BuilderProfile = BuilderProfile;
