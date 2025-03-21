import { Timestamp } from 'firebase/firestore';

import { StockInformation } from '../../models';

export interface Holding extends StockInformation {
    avgPrice?: number;
    change?: number;
    dateOfPurchase: Date | Timestamp;
    id?: string;
    imgSource?: string;
    investAmount?: number;
    investmentType: string;
    notes?: string;
    percent?: number;
    price: number;
    shares: number;
    ticker: string;
    totalCost?: number;
    transactions?: number;
    value?: number;
}
