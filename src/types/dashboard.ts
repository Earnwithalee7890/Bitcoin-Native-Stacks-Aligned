export interface MarketData {
    price: number;
    change: number;
}

export interface ActivityItem {
    user: string;
    fullAddress: string;
    action: string;
    time: string;
    icon: any;
    color: string;
}

export interface UserStats {
    count: number;
    last_active: string;
}

export interface NetworkStats {
    tps: number;
    volume_24h: string;
}

export interface SearchResult {
    address: string;
    score: number;
}
