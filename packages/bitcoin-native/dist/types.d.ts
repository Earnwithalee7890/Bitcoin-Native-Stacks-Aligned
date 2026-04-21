/**
 * Type definitions for @earnwithalee/bitcoin-native
 */
export type BitcoinNetwork = 'mainnet' | 'testnet' | 'regtest';
export type StacksNetwork = 'mainnet' | 'testnet' | 'devnet';
export interface ContractCallOptions {
    /** Contract identifier in the format "address.contract-name" */
    contractId: string;
    /** Name of the function to call */
    functionName: string;
    /** Encoded function arguments */
    functionArgs: string[];
    /** Network to use */
    network: StacksNetwork;
    /** Optional sender address for read-only calls */
    senderAddress?: string;
    /** Post-condition mode */
    postConditionMode?: 'allow' | 'deny';
}
export interface TransactionResult {
    txId: string;
    status: 'pending' | 'success' | 'failed' | 'dropped';
    blockHeight?: number;
    blockHash?: string;
    burnBlockTime?: number;
    fee?: number;
    nonce?: number;
    senderAddress: string;
    rawResult?: string;
}
export interface BuilderScore {
    address: string;
    totalCheckIns: number;
    totalPulses: number;
    lastActive: string;
    reputationScore: number;
    rank: number;
    streak: number;
    level: BuilderLevel;
}
export type BuilderLevel = 'newcomer' | 'active' | 'builder' | 'architect' | 'legend';
export interface BalanceInfo {
    stx: number;
    stxLocked: number;
    burnchainBalance: number;
    fungibleTokens: TokenBalance[];
    nonFungibleTokens: NFTBalance[];
}
export interface TokenBalance {
    tokenId: string;
    balance: number;
    totalSent: number;
    totalReceived: number;
}
export interface NFTBalance {
    assetIdentifier: string;
    count: number;
    ids: string[];
}
export interface BlockInfo {
    height: number;
    hash: string;
    burnBlockTime: number;
    burnBlockHash: string;
    parentBlockHash: string;
    txCount: number;
    microblockCount: number;
}
export interface NetworkStatus {
    online: boolean;
    currentBlock: number;
    networkId: number;
    chainTip: string;
    peerCount: number;
    mempoolSize: number;
}
export interface ContractInfo {
    contractId: string;
    blockHeight: number;
    sourcePath: string;
    abi: any;
    functions: ContractFunction[];
}
export interface ContractFunction {
    name: string;
    access: 'public' | 'read_only' | 'private';
    args: FunctionArg[];
    outputs: any;
}
export interface FunctionArg {
    name: string;
    type: string;
}
export interface MempoolTransaction {
    txId: string;
    txType: string;
    fee: number;
    nonce: number;
    senderAddress: string;
    receiptTime: number;
}
