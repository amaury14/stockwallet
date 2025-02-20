import { Timestamp } from 'firebase/firestore';

export interface Portfolio {
    createdAt: Date | Timestamp;
    id?: string;
    name: string;
}
