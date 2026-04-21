/**
 * Unit conversion utilities for STX and BTC.
 */

const STX_DECIMALS = 6;
const BTC_DECIMALS = 8;
const MICRO_STX_PER_STX = 1_000_000;
const SATS_PER_BTC = 100_000_000;

export class STXConverter {
  /**
   * Convert microSTX to STX
   */
  static toSTX(microStx: number | bigint): number {
    return Number(microStx) / MICRO_STX_PER_STX;
  }

  /**
   * Convert STX to microSTX
   */
  static toMicroSTX(stx: number): bigint {
    return BigInt(Math.round(stx * MICRO_STX_PER_STX));
  }

  /**
   * Format STX amount for display
   */
  static format(microStx: number | bigint, decimals: number = 2): string {
    const stx = STXConverter.toSTX(microStx);
    return stx.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  /**
   * Format with the STX symbol
   */
  static formatWithSymbol(microStx: number | bigint, decimals: number = 2): string {
    return `${STXConverter.format(microStx, decimals)} STX`;
  }

  /**
   * Parse a human-readable STX string to microSTX
   */
  static parse(stxString: string): bigint {
    const cleaned = stxString.replace(/[^0-9.]/g, '');
    const value = parseFloat(cleaned);
    if (isNaN(value)) throw new Error(`Invalid STX amount: "${stxString}"`);
    return STXConverter.toMicroSTX(value);
  }
}

export class BTCConverter {
  /**
   * Convert satoshis to BTC
   */
  static toBTC(satoshis: number | bigint): number {
    return Number(satoshis) / SATS_PER_BTC;
  }

  /**
   * Convert BTC to satoshis
   */
  static toSatoshis(btc: number): bigint {
    return BigInt(Math.round(btc * SATS_PER_BTC));
  }

  /**
   * Format BTC amount for display
   */
  static format(satoshis: number | bigint, decimals: number = 8): string {
    const btc = BTCConverter.toBTC(satoshis);
    return btc.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  /**
   * Format with the BTC symbol
   */
  static formatWithSymbol(satoshis: number | bigint, decimals: number = 8): string {
    return `₿${BTCConverter.format(satoshis, decimals)}`;
  }
}

export class UnitConverter {
  /**
   * Estimate STX value in BTC given a price ratio
   * @param microStx - Amount in microSTX
   * @param stxPerBtc - How many STX per 1 BTC
   */
  static stxToBtcEstimate(microStx: number | bigint, stxPerBtc: number): number {
    const stx = STXConverter.toSTX(microStx);
    return stx / stxPerBtc;
  }

  /**
   * Estimate STX value in USD
   * @param microStx - Amount in microSTX
   * @param stxPriceUsd - STX price in USD
   */
  static stxToUsd(microStx: number | bigint, stxPriceUsd: number): number {
    const stx = STXConverter.toSTX(microStx);
    return stx * stxPriceUsd;
  }

  /**
   * Format USD amount for display
   */
  static formatUsd(amount: number): string {
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
  static formatCompact(value: number): string {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toString();
  }
}
