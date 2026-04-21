/**
 * Address validation and utilities for Bitcoin and Stacks addresses.
 */

const STX_ADDRESS_REGEX = /^S[PM][A-Z0-9]{38,39}$/;
const BTC_P2PKH_REGEX = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
const BTC_P2SH_REGEX = /^3[a-km-zA-HJ-NP-Z1-9]{25,34}$/;
const BTC_BECH32_REGEX = /^(bc1|tb1)[a-z0-9]{25,90}$/;

export class BitcoinAddress {
  private address: string;

  constructor(address: string) {
    this.address = address.trim();
  }

  /**
   * Check if the address is a valid Bitcoin address (P2PKH, P2SH, or Bech32)
   */
  isValid(): boolean {
    return this.isP2PKH() || this.isP2SH() || this.isBech32();
  }

  isP2PKH(): boolean {
    return BTC_P2PKH_REGEX.test(this.address);
  }

  isP2SH(): boolean {
    return BTC_P2SH_REGEX.test(this.address);
  }

  isBech32(): boolean {
    return BTC_BECH32_REGEX.test(this.address);
  }

  /**
   * Get the address type
   */
  getType(): 'P2PKH' | 'P2SH' | 'Bech32' | 'unknown' {
    if (this.isP2PKH()) return 'P2PKH';
    if (this.isP2SH()) return 'P2SH';
    if (this.isBech32()) return 'Bech32';
    return 'unknown';
  }

  /**
   * Format address with ellipsis for UI display
   */
  format(prefixLen: number = 6, suffixLen: number = 4): string {
    if (this.address.length <= prefixLen + suffixLen + 3) return this.address;
    return `${this.address.slice(0, prefixLen)}...${this.address.slice(-suffixLen)}`;
  }

  toString(): string {
    return this.address;
  }
}

export class StacksAddress {
  private address: string;

  constructor(address: string) {
    this.address = address.trim();
  }

  /**
   * Check if this is a valid Stacks address
   */
  isValid(): boolean {
    return STX_ADDRESS_REGEX.test(this.address);
  }

  /**
   * Check if this is a mainnet address (starts with SP)
   */
  isMainnet(): boolean {
    return this.address.startsWith('SP');
  }

  /**
   * Check if this is a testnet address (starts with SM or ST)
   */
  isTestnet(): boolean {
    return this.address.startsWith('ST') || this.address.startsWith('SM');
  }

  /**
   * Format address with ellipsis for UI display
   */
  format(prefixLen: number = 6, suffixLen: number = 4): string {
    if (this.address.length <= prefixLen + suffixLen + 3) return this.address;
    return `${this.address.slice(0, prefixLen)}...${this.address.slice(-suffixLen)}`;
  }

  /**
   * Create a contract identifier by appending the contract name
   */
  withContract(contractName: string): string {
    return `${this.address}.${contractName}`;
  }

  toString(): string {
    return this.address;
  }
}

export class AddressValidator {
  /**
   * Validate any blockchain address (Bitcoin or Stacks)
   */
  static validate(address: string): { valid: boolean; chain: 'bitcoin' | 'stacks' | 'unknown'; type: string } {
    const stx = new StacksAddress(address);
    if (stx.isValid()) {
      return {
        valid: true,
        chain: 'stacks',
        type: stx.isMainnet() ? 'mainnet' : 'testnet'
      };
    }

    const btc = new BitcoinAddress(address);
    if (btc.isValid()) {
      return {
        valid: true,
        chain: 'bitcoin',
        type: btc.getType()
      };
    }

    return { valid: false, chain: 'unknown', type: 'unknown' };
  }

  /**
   * Format any address for display
   */
  static formatAddress(address: string, prefixLen: number = 6, suffixLen: number = 4): string {
    if (address.length <= prefixLen + suffixLen + 3) return address;
    return `${address.slice(0, prefixLen)}...${address.slice(-suffixLen)}`;
  }

  /**
   * Check if two addresses are the same (case-insensitive for BTC, exact for STX)
   */
  static isSameAddress(a: string, b: string): boolean {
    const va = AddressValidator.validate(a);
    const vb = AddressValidator.validate(b);

    if (va.chain === 'bitcoin' && vb.chain === 'bitcoin') {
      return a.toLowerCase() === b.toLowerCase();
    }
    return a === b;
  }
}
