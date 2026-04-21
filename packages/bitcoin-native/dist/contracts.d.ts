/**
 * Smart contract helpers for Clarity contracts on Stacks.
 */
import type { ContractCallOptions } from './types';
export declare class ContractHelper {
    /**
     * Parse a contract identifier into deployer and name
     */
    static parseContractId(contractId: string): {
        deployer: string;
        name: string;
    };
    /**
     * Build a contract identifier from deployer address and contract name
     */
    static buildContractId(deployer: string, name: string): string;
    /**
     * Validate a contract identifier format
     */
    static isValidContractId(contractId: string): boolean;
    /**
     * Create a read-only function call options object
     */
    static readOnly(contractId: string, functionName: string, args?: string[], senderAddress?: string): ContractCallOptions;
    /**
     * Create a public function call options object
     */
    static publicCall(contractId: string, functionName: string, args?: string[], network?: 'mainnet' | 'testnet'): ContractCallOptions;
    /**
     * Generate a Hiro Explorer URL for a contract
     */
    static explorerUrl(contractId: string, network?: 'mainnet' | 'testnet'): string;
}
export declare class ClarityValueEncoder {
    /**
     * Encode a uint value for Clarity
     */
    static uint(value: number | bigint): string;
    /**
     * Encode an int value for Clarity
     */
    static int(value: number | bigint): string;
    /**
     * Encode a boolean for Clarity
     */
    static bool(value: boolean): string;
    /**
     * Encode a principal (standard or contract) for Clarity
     */
    static principal(address: string): string;
    /**
     * Encode an ASCII string for Clarity
     */
    static stringAscii(value: string): string;
    /**
     * Encode a UTF-8 string for Clarity
     */
    static stringUtf8(value: string): string;
    /**
     * Encode a none optional for Clarity
     */
    static none(): string;
    /**
     * Encode a buffer for Clarity
     */
    static buffer(data: Buffer | Uint8Array): string;
}
