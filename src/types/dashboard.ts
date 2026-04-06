export interface MarketData {
    price: number;
    change: number;
}

export interface ActivityItem {
    tx_id: string;
    tx_status: "success" | "pending" | "failed" | "dropped";
    block_height: number;
    burn_block_time: number;
    sender_address: string;
    tx_type: string;
    contract_call?: {
        contract_id: string;
        function_name: string;
    };
    // Derived fields for UI
    user: string;
    fullAddress: string;
    action: string;
    time: string;
    icon: any; // Lucide icon component
    color: string;
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

// Hiro API Response Types
export interface HiroTransactionsResponse {
    limit: number;
    offset: number;
    total: number;
    results: any[]; // Raw results to be formatted
}

export interface HiroTxResponse {
    tx_id: string;
    tx_status: "success" | "pending" | "failed" | "dropped";
    tx_type: string;
    fee_rate: string;
    sender_address: string;
    burn_block_time: number;
}
