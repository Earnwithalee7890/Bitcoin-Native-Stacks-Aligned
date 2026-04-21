/**
 * Unit conversion utilities for STX and BTC.
 */
export declare class STXConverter {
    /**
     * Convert microSTX to STX
     */
    static toSTX(microStx: number | bigint): number;
    /**
     * Convert STX to microSTX
     */
    static toMicroSTX(stx: number): bigint;
    /**
     * Format STX amount for display
     */
    static format(microStx: number | bigint, decimals?: number): string;
    /**
     * Format with the STX symbol
     */
    static formatWithSymbol(microStx: number | bigint, decimals?: number): string;
    /**
     * Parse a human-readable STX string to microSTX
     */
    static parse(stxString: string): bigint;
}
export declare class BTCConverter {
    /**
     * Convert satoshis to BTC
     */
    static toBTC(satoshis: number | bigint): number;
    /**
     * Convert BTC to satoshis
     */
    static toSatoshis(btc: number): bigint;
    /**
     * Format BTC amount for display
     */
    static format(satoshis: number | bigint, decimals?: number): string;
    /**
     * Format with the BTC symbol
     */
    static formatWithSymbol(satoshis: number | bigint, decimals?: number): string;
}
export declare class UnitConverter {
    /**
     * Estimate STX value in BTC given a price ratio
     * @param microStx - Amount in microSTX
     * @param stxPerBtc - How many STX per 1 BTC
     */
    static stxToBtcEstimate(microStx: number | bigint, stxPerBtc: number): number;
    /**
     * Estimate STX value in USD
     * @param microStx - Amount in microSTX
     * @param stxPriceUsd - STX price in USD
     */
    static stxToUsd(microStx: number | bigint, stxPriceUsd: number): number;
    /**
     * Format USD amount for display
     */
    static formatUsd(amount: number): string;
    /**
     * Format a large number with K/M/B suffixes
     */
    static formatCompact(value: number): string;
}
