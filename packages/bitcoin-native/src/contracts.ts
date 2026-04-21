/**
 * Smart contract helpers for Clarity contracts on Stacks.
 */

import type { ContractCallOptions, ContractFunction } from './types';

export class ContractHelper {
  /**
   * Parse a contract identifier into deployer and name
   */
  static parseContractId(contractId: string): { deployer: string; name: string } {
    const parts = contractId.split('.');
    if (parts.length !== 2) {
      throw new Error(`Invalid contract ID format: "${contractId}". Expected "address.contract-name"`);
    }
    return { deployer: parts[0], name: parts[1] };
  }

  /**
   * Build a contract identifier from deployer address and contract name
   */
  static buildContractId(deployer: string, name: string): string {
    return `${deployer}.${name}`;
  }

  /**
   * Validate a contract identifier format
   */
  static isValidContractId(contractId: string): boolean {
    const parts = contractId.split('.');
    if (parts.length !== 2) return false;
    const [address, name] = parts;
    return address.length > 0 && /^[a-zA-Z][a-zA-Z0-9-]*$/.test(name);
  }

  /**
   * Create a read-only function call options object
   */
  static readOnly(contractId: string, functionName: string, args: string[] = [], senderAddress?: string): ContractCallOptions {
    return {
      contractId,
      functionName,
      functionArgs: args,
      network: 'mainnet',
      senderAddress: senderAddress || contractId.split('.')[0],
    };
  }

  /**
   * Create a public function call options object
   */
  static publicCall(contractId: string, functionName: string, args: string[] = [], network: 'mainnet' | 'testnet' = 'mainnet'): ContractCallOptions {
    return {
      contractId,
      functionName,
      functionArgs: args,
      network,
      postConditionMode: 'deny',
    };
  }

  /**
   * Generate a Hiro Explorer URL for a contract
   */
  static explorerUrl(contractId: string, network: 'mainnet' | 'testnet' = 'mainnet'): string {
    const chain = network === 'mainnet' ? 'mainnet' : 'testnet';
    return `https://explorer.hiro.so/txid/${contractId}?chain=${chain}`;
  }
}

export class ClarityValueEncoder {
  /**
   * Encode a uint value for Clarity
   */
  static uint(value: number | bigint): string {
    return `0x0100000000000000000000000000000000${BigInt(value).toString(16).padStart(16, '0')}`;
  }

  /**
   * Encode an int value for Clarity
   */
  static int(value: number | bigint): string {
    const v = BigInt(value);
    return `0x0000000000000000000000000000000000${(v < 0 ? (BigInt(2) ** BigInt(128) + v) : v).toString(16).padStart(16, '0')}`;
  }

  /**
   * Encode a boolean for Clarity
   */
  static bool(value: boolean): string {
    return value ? '0x03' : '0x04';
  }

  /**
   * Encode a principal (standard or contract) for Clarity
   */
  static principal(address: string): string {
    // Simplified — in production, you'd use proper c32check encoding
    return `principal:${address}`;
  }

  /**
   * Encode an ASCII string for Clarity
   */
  static stringAscii(value: string): string {
    const hex = Buffer.from(value, 'ascii').toString('hex');
    const lenHex = value.length.toString(16).padStart(8, '0');
    return `0x0d${lenHex}${hex}`;
  }

  /**
   * Encode a UTF-8 string for Clarity
   */
  static stringUtf8(value: string): string {
    const hex = Buffer.from(value, 'utf8').toString('hex');
    const len = Buffer.byteLength(value, 'utf8');
    const lenHex = len.toString(16).padStart(8, '0');
    return `0x0e${lenHex}${hex}`;
  }

  /**
   * Encode a none optional for Clarity
   */
  static none(): string {
    return '0x09';
  }

  /**
   * Encode a buffer for Clarity
   */
  static buffer(data: Buffer | Uint8Array): string {
    const hex = Buffer.from(data).toString('hex');
    const lenHex = data.length.toString(16).padStart(8, '0');
    return `0x02${lenHex}${hex}`;
  }
}
