/**
 * @earnwithalee/bitcoin-native
 * 
 * Bitcoin-native utilities for Stacks blockchain development.
 * Provides address validation, STX/BTC conversion, contract helpers,
 * on-chain identity tools, and network utilities.
 */

export { BitcoinAddress, StacksAddress, AddressValidator } from './address';
export { STXConverter, BTCConverter, UnitConverter } from './converter';
export { ContractHelper, ClarityValueEncoder } from './contracts';
export { NetworkConfig, NetworkUtils, NETWORKS } from './network';
export { OnChainIdentity, BuilderProfile } from './identity';
export { TransactionUtils, TxStatusChecker } from './transactions';
export { StacksAPI } from './api';

// Re-export types
export type {
  BitcoinNetwork,
  StacksNetwork,
  ContractCallOptions,
  TransactionResult,
  BuilderScore,
  BalanceInfo,
  BlockInfo
} from './types';
