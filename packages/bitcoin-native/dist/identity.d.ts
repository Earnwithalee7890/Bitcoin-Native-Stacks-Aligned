/**
 * On-chain identity and builder profile utilities.
 */
import type { BuilderScore, BuilderLevel } from './types';
export declare class OnChainIdentity {
    private address;
    private network;
    constructor(address: string, network?: 'mainnet' | 'testnet');
    /**
     * Get the on-chain transaction count for this address
     */
    getTransactionCount(): Promise<number>;
    /**
     * Get the STX balance in microSTX
     */
    getBalance(): Promise<number>;
    /**
     * Get contracts deployed by this address
     */
    getDeployedContracts(): Promise<string[]>;
    /**
     * Get the address used
     */
    getAddress(): string;
    /**
     * Get the formatted address for display
     */
    getFormattedAddress(): string;
}
export declare class BuilderProfile {
    /**
     * Calculate a builder level based on activity metrics
     */
    static calculateLevel(checkIns: number, pulses: number, deployments: number): BuilderLevel;
    /**
     * Calculate a reputation score (0-1000)
     */
    static calculateReputation(params: {
        checkIns: number;
        pulses: number;
        contractDeployments: number;
        transactionCount: number;
        streak: number;
        accountAge: number;
    }): number;
    /**
     * Get the title for a given builder level
     */
    static getLevelTitle(level: BuilderLevel): string;
    /**
     * Get the color associated with a builder level
     */
    static getLevelColor(level: BuilderLevel): string;
    /**
     * Create a full builder score object
     */
    static createScore(address: string, params: {
        checkIns: number;
        pulses: number;
        contractDeployments: number;
        transactionCount: number;
        streak: number;
        accountAge: number;
    }): BuilderScore;
}
