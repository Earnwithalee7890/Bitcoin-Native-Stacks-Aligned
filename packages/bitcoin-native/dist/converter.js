"use strict";
/**
 * Unit conversion utilities for STX and BTC.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitConverter = exports.BTCConverter = exports.STXConverter = void 0;
const STX_DECIMALS = 6;
const BTC_DECIMALS = 8;
const MICRO_STX_PER_STX = 1000000;
const SATS_PER_BTC = 100000000;
class STXConverter {
    /**
     * Convert microSTX to STX
     */
    static toSTX(microStx) {
        return Number(microStx) / MICRO_STX_PER_STX;
    }
    /**
     * Convert STX to microSTX
     */
    static toMicroSTX(stx) {
        return BigInt(Math.round(stx * MICRO_STX_PER_STX));
    }
    /**
     * Format STX amount for display
     */
    static format(microStx, decimals = 2) {
        const stx = STXConverter.toSTX(microStx);
        return stx.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        });
    }
    /**
     * Format with the STX symbol
     */
    static formatWithSymbol(microStx, decimals = 2) {
        return `${STXConverter.format(microStx, decimals)} STX`;
    }
    /**
     * Parse a human-readable STX string to microSTX
     */
    static parse(stxString) {
        const cleaned = stxString.replace(/[^0-9.]/g, '');
        const value = parseFloat(cleaned);
        if (isNaN(value))
            throw new Error(`Invalid STX amount: "${stxString}"`);
        return STXConverter.toMicroSTX(value);
    }
}
exports.STXConverter = STXConverter;
class BTCConverter {
    /**
     * Convert satoshis to BTC
     */
    static toBTC(satoshis) {
        return Number(satoshis) / SATS_PER_BTC;
    }
    /**
     * Convert BTC to satoshis
     */
    static toSatoshis(btc) {
        return BigInt(Math.round(btc * SATS_PER_BTC));
    }
    /**
     * Format BTC amount for display
     */
    static format(satoshis, decimals = 8) {
        const btc = BTCConverter.toBTC(satoshis);
        return btc.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        });
    }
    /**
     * Format with the BTC symbol
     */
    static formatWithSymbol(satoshis, decimals = 8) {
        return `₿${BTCConverter.format(satoshis, decimals)}`;
    }
}
exports.BTCConverter = BTCConverter;
class UnitConverter {
    /**
     * Estimate STX value in BTC given a price ratio
     * @param microStx - Amount in microSTX
     * @param stxPerBtc - How many STX per 1 BTC
     */
    static stxToBtcEstimate(microStx, stxPerBtc) {
        const stx = STXConverter.toSTX(microStx);
        return stx / stxPerBtc;
    }
    /**
     * Estimate STX value in USD
     * @param microStx - Amount in microSTX
     * @param stxPriceUsd - STX price in USD
     */
    static stxToUsd(microStx, stxPriceUsd) {
        const stx = STXConverter.toSTX(microStx);
        return stx * stxPriceUsd;
    }
    /**
     * Format USD amount for display
     */
    static formatUsd(amount) {
        return amount.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }
    /**
     * Format a large number with K/M/B suffixes
     */
    static formatCompact(value) {
        if (value >= 1000000000)
            return `${(value / 1000000000).toFixed(1)}B`;
        if (value >= 1000000)
            return `${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000)
            return `${(value / 1000).toFixed(1)}K`;
        return value.toString();
    }
}
exports.UnitConverter = UnitConverter;
