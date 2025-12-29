export interface MarketData {
    price: number;
    change: number;
}

export interface ActivityItem {
    tx_id: string;
    tx_status: string;
    block_height: number;
    burn_block_time: number;
    sender_address: string;
    tx_type: string;
    contract_call?: {
        function_name: string;
    };
    // Derived fields for UI
    user?: string;
    fullAddress?: string;
    action?: string;
    time?: string;
    icon?: any;
    color?: string;
}

export interface UserStats {
    count: number;
    last_active: string;
    checkInCount: number;
    lastActive: string;
}

export interface NetworkStats {
    tps: number;
    volume_24h: string;
}

export interface SearchResult {
    address: string;
    score: number;
    reputationScore: number;
    githubVerified: boolean;
    talentScore: number;
}
