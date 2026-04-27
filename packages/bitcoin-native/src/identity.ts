/**
 * On-chain identity and builder profile utilities.
 */

import type { BuilderScore, BuilderLevel } from './types';
import { NetworkConfig } from './network';
import { AddressValidator } from './address';

export class OnChainIdentity {
  private address: string;
  private network: NetworkConfig;

  constructor(address: string, network: 'mainnet' | 'testnet' = 'mainnet') {
    this.address = address;
    this.network = new NetworkConfig(network);
  }

  /**
   * Get the on-chain transaction count for this address
   */
  async getTransactionCount(): Promise<number> {
    try {
      const response = await fetch(
        this.network.apiUrl(`/extended/v1/address/${this.address}/transactions?limit=1`)
      );
      if (!response.ok) return 0;
      const data: any = await response.json();
      return data.total || 0;
    } catch {
      return 0;
    }
  }

  /**
   * Get the STX balance in microSTX
   */
  async getBalance(): Promise<number> {
    try {
      const response = await fetch(
        this.network.apiUrl(`/extended/v1/address/${this.address}/stx`)
      );
      if (!response.ok) return 0;
      const data: any = await response.json();
      return parseInt(data.balance || '0', 10);
    } catch {
      return 0;
    }
  }

  /**
   * Get contracts deployed by this address
   */
  async getDeployedContracts(): Promise<string[]> {
    try {
      const response = await fetch(
        this.network.apiUrl(`/extended/v1/address/${this.address}/transactions?limit=50`)
      );
      if (!response.ok) return [];
      const data: any = await response.json();
      return data.results
        .filter((tx: any) => tx.tx_type === 'smart_contract' && tx.tx_status === 'success')
        .map((tx: any) => tx.smart_contract?.contract_id)
        .filter(Boolean);
    } catch {
      return [];
    }
  }

  /**
   * Get the address used
   */
  getAddress(): string {
    return this.address;
  }

  /**
   * Get the formatted address for display
   */
  getFormattedAddress(): string {
    return AddressValidator.formatAddress(this.address);
  }
}

export class BuilderProfile {
  /**
   * Calculate a builder level based on activity metrics
   */
  static calculateLevel(checkIns: number, pulses: number, deployments: number): BuilderLevel {
    const score = checkIns * 10 + pulses * 5 + deployments * 50;
    
    if (score >= 1000) return 'legend';
    if (score >= 500) return 'architect';
    if (score >= 200) return 'builder';
    if (score >= 50) return 'active';
    return 'newcomer';
  }

  /**
   * Calculate a reputation score (0-1000)
   */
  static calculateReputation(params: {
    checkIns: number;
    pulses: number;
    contractDeployments: number;
    transactionCount: number;
    streak: number;
    accountAge: number;
  }): number {
    const {
      checkIns,
      pulses,
      contractDeployments,
      transactionCount,
      streak,
      accountAge,
    } = params;

    let score = 0;
    score += Math.min(checkIns * 10, 200);
    score += Math.min(pulses * 5, 100);
    score += Math.min(contractDeployments * 50, 200);
    score += Math.min(transactionCount * 2, 150);
    score += Math.min(streak * 15, 200);
    score += Math.min(accountAge, 150);

    return Math.min(score, 1000);
  }

  /**
   * Get the title for a given builder level
   */
  static getLevelTitle(level: BuilderLevel): string {
    const titles: Record<BuilderLevel, string> = {
      newcomer: '🌱 Newcomer',
      active: '⚡ Active Builder',
      builder: '🔨 Builder',
      architect: '🏗️ Architect',
      legend: '🏆 Legend',
    };
    return titles[level];
  }

  /**
   * Get the color associated with a builder level
   */
  static getLevelColor(level: BuilderLevel): string {
    const colors: Record<BuilderLevel, string> = {
      newcomer: '#6B7280',
      active: '#3B82F6',
      builder: '#8B5CF6',
      architect: '#F59E0B',
      legend: '#EF4444',
    };
    return colors[level];
  }

  /**
   * Create a full builder score object
   */
  static createScore(
    address: string,
    params: {
      checkIns: number;
      pulses: number;
      contractDeployments: number;
      transactionCount: number;
      streak: number;
      accountAge: number;
    }
  ): BuilderScore {
    const level = BuilderProfile.calculateLevel(
      params.checkIns,
      params.pulses,
      params.contractDeployments
    );
    const reputationScore = BuilderProfile.calculateReputation(params);

    return {
      address,
      totalCheckIns: params.checkIns,
      totalPulses: params.pulses,
      lastActive: new Date().toISOString(),
      reputationScore,
      rank: 0,
      streak: params.streak,
      level,
    };
  }
}

// Quality improvement iteration 0

// Quality improvement iteration 1

// Quality improvement iteration 2
