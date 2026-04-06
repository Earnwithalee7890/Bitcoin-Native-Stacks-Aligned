declare module '@earnwithalee/stacksrank-sdk' {
  export const encoding: {
    encodeStringAscii: (str: string) => string;
    encodeStringUtf8: (str: string) => string;
    encodeUint: (val: number | bigint) => string;
    encodeInt: (val: number | bigint) => string;
    encodeBool: (val: boolean) => string;
    encodePrincipal: (addr: string) => string;
    encodeBuffer: (data: Buffer | Uint8Array) => string;
  };
  export const contracts: {
    CONTRACTS: any;
    DEPLOYER: string;
    getContractAddresses: () => {
      REPUTATION: string;
      SWAP: string;
      VAULT: string;
      FEB_CHECKIN: string;
      BUILDER_TOOLS: string;
      FEE_DISTRIBUTOR: string;
      STX_DISTRIBUTOR: string;
    };
  };
  export const wallet: {
    detectWallet: () => { available: boolean; provider: any };
    connectWallet: () => Promise<string>;
    callContract: (opts: {
      contract: string;
      functionName: string;
      functionArgs: any[];
      network: 'mainnet' | 'testnet';
    }) => Promise<any>;
    formatAddress: (addr: string) => string;
  };
  export const api: {
    getBalance: (addr: string, network?: 'mainnet' | 'testnet') => Promise<{ stx: number; tokens: any[] }>;
    getTransactions: (addr: string, opts?: any) => Promise<any[]>;
    getTransactionStatus: (txId: string) => Promise<string>;
    readContract: (addr: string, name: string, fn: string) => Promise<any>;
    getBlockHeight: (network?: 'mainnet' | 'testnet') => Promise<number>;
    microToStx: (val: number | bigint) => number;
    stxToMicro: (val: number | bigint) => number;
  };
}
