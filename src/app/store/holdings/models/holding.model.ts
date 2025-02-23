import { Timestamp } from 'firebase/firestore';

export interface Holding {
    amount: number;
    dateOfPurchase: Date | Timestamp;
    id?: string;
    price: number;
    ticker: string;
}
