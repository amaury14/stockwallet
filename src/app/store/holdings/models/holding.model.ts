import { Timestamp } from 'firebase/firestore';

export interface Holding {
    avgPrice?: number;
    change?: number;
    dateOfPurchase: Date | Timestamp;
    id?: string;
    price: number;
    shares: number;
    ticker: string;
    totalCost?: number;
    transactions?: number;
    value?: number;
}
