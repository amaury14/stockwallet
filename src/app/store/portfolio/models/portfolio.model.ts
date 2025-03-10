import { Timestamp } from 'firebase/firestore';

export interface Portfolio {
    cashAmount?: number;
    createdAt: Date | Timestamp;
    id?: string;
    name: string;
    description?: string;
}
