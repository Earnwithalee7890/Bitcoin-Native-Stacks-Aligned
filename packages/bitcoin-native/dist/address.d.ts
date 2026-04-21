/**
 * Address validation and utilities for Bitcoin and Stacks addresses.
 */
export declare class BitcoinAddress {
    private address;
    constructor(address: string);
    /**
     * Check if the address is a valid Bitcoin address (P2PKH, P2SH, or Bech32)
     */
    isValid(): boolean;
    isP2PKH(): boolean;
    isP2SH(): boolean;
    isBech32(): boolean;
    /**
     * Get the address type
     */
    getType(): 'P2PKH' | 'P2SH' | 'Bech32' | 'unknown';
    /**
     * Format address with ellipsis for UI display
     */
    format(prefixLen?: number, suffixLen?: number): string;
    toString(): string;
}
export declare class StacksAddress {
    private address;
    constructor(address: string);
    /**
     * Check if this is a valid Stacks address
     */
    isValid(): boolean;
    /**
     * Check if this is a mainnet address (starts with SP)
     */
    isMainnet(): boolean;
    /**
     * Check if this is a testnet address (starts with SM or ST)
     */
    isTestnet(): boolean;
    /**
     * Format address with ellipsis for UI display
     */
    format(prefixLen?: number, suffixLen?: number): string;
    /**
     * Create a contract identifier by appending the contract name
     */
    withContract(contractName: string): string;
    toString(): string;
}
export declare class AddressValidator {
    /**
     * Validate any blockchain address (Bitcoin or Stacks)
     */
    static validate(address: string): {
        valid: boolean;
        chain: 'bitcoin' | 'stacks' | 'unknown';
        type: string;
    };
    /**
     * Format any address for display
     */
    static formatAddress(address: string, prefixLen?: number, suffixLen?: number): string;
    /**
     * Check if two addresses are the same (case-insensitive for BTC, exact for STX)
     */
    static isSameAddress(a: string, b: string): boolean;
}
