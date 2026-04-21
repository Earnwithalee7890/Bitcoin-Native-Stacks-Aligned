# @earnwithalee/bitcoin-native

> Bitcoin-native utilities for Stacks blockchain development.

A comprehensive toolkit for building applications on the Stacks (Bitcoin L2) ecosystem. Provides address validation, STX/BTC unit conversion, Clarity contract helpers, on-chain identity scoring, transaction utilities, and a lightweight Stacks API client.

## Installation

```bash
npm install @earnwithalee/bitcoin-native
```

## Features

- 🔐 **Address Validation** — Validate Bitcoin (P2PKH, P2SH, Bech32) and Stacks addresses
- 💰 **Unit Conversion** — Convert between STX/microSTX, BTC/satoshis, and USD
- 📜 **Contract Helpers** — Parse contract IDs, encode Clarity values, build contract calls
- 🌐 **Network Config** — Pre-configured mainnet/testnet/devnet network definitions
- 🏗️ **Builder Identity** — Calculate reputation scores and builder levels
- ⚡ **Transaction Utils** — Format, track, and wait for transaction confirmations
- 🔍 **Stacks API Client** — Lightweight wrapper around the Hiro API

## Quick Start

```typescript
import {
  StacksAddress,
  STXConverter,
  ContractHelper,
  NetworkConfig,
  BuilderProfile,
  StacksAPI,
  TransactionUtils,
} from '@earnwithalee/bitcoin-native';

// Validate a Stacks address
const addr = new StacksAddress('SP2J6ZY48GV1EZ...');
console.log(addr.isMainnet()); // true
console.log(addr.format());    // "SP2J6Z...1EZ"

// Convert units
const stx = STXConverter.toSTX(1500000); // 1.5
console.log(STXConverter.formatWithSymbol(1500000)); // "1.50 STX"

// Work with contracts
const parsed = ContractHelper.parseContractId('SP123.my-contract');
console.log(parsed); // { deployer: 'SP123', name: 'my-contract' }

// Check transaction status
const explorerUrl = TransactionUtils.explorerUrl('0xabc...');

// Calculate builder reputation
const score = BuilderProfile.calculateReputation({
  checkIns: 15,
  pulses: 30,
  contractDeployments: 2,
  transactionCount: 50,
  streak: 7,
  accountAge: 90,
});
console.log(score); // 615

// Use the API client
const api = new StacksAPI('mainnet');
const balance = await api.getBalance('SP2J6ZY48GV1EZ...');
console.log(balance.stx); // 150.5
```

## API Reference

### Address Module
- `BitcoinAddress` — Bitcoin address validation and formatting
- `StacksAddress` — Stacks address validation and formatting
- `AddressValidator` — Universal address validation

### Converter Module
- `STXConverter` — microSTX ↔ STX conversion and formatting
- `BTCConverter` — satoshis ↔ BTC conversion and formatting
- `UnitConverter` — Cross-currency estimates and compact formatting

### Contract Module
- `ContractHelper` — Parse, build, and validate contract identifiers
- `ClarityValueEncoder` — Encode values for Clarity contract calls

### Network Module
- `NetworkConfig` — Network configuration with URL builders
- `NetworkUtils` — Network detection and health checking
- `NETWORKS` — Pre-configured network definitions

### Identity Module
- `OnChainIdentity` — Fetch on-chain data for an address
- `BuilderProfile` — Calculate reputation scores and builder levels

### Transaction Module
- `TransactionUtils` — Format, classify, and build explorer URLs
- `TxStatusChecker` — Poll and wait for transaction confirmations

### API Module
- `StacksAPI` — Full Stacks API client (balance, blocks, contracts, pricing)

## License

MIT © earnwithalee
