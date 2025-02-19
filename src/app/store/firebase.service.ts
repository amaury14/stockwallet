import { Injectable } from '@angular/core';
import { DocumentData, DocumentReference, Firestore, addDoc, collection, deleteDoc, doc, getDocs, getFirestore, query, updateDoc } from 'firebase/firestore';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Analytics, getAnalytics } from 'firebase/analytics';
import { Observable, from } from 'rxjs';

import { environment } from '../../environments/environment';
import { RequestStatus } from './models';

@Injectable({
    providedIn: 'root',
})
export class FirebaseService {
    public analytics: Analytics;
    public app: FirebaseApp;
    public firestore: Firestore;

    constructor() {
        this.app = initializeApp(environment.firebaseConfig);
        this.analytics = getAnalytics(this.app);
        // Initialize Cloud Firestore and get a reference to the service
        this.firestore = getFirestore(this.app);
    }

    initializeApp(): void {
        this.app = initializeApp(environment.firebaseConfig);
        this.analytics = getAnalytics(this.app);
        // Initialize Cloud Firestore and get a reference to the service
        this.firestore = getFirestore(this.app);
    }

    getDocuments(collectionName: string): Observable<DocumentData[] | RequestStatus> {
        return from(getDocs(query(collection(this.firestore, collectionName))).then(item => item?.docs?.map((doc) => ({ id: doc.id, ...doc.data() }))).catch(() => RequestStatus.ERROR));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addDocument(collectionName: string, data: any): Observable<DocumentReference<any> | RequestStatus> {
        return from(addDoc(collection(this.firestore, collectionName), data).then((data) => data).catch(() => RequestStatus.ERROR));
    }

    deleteDocument(collectionName: string, id: string): Observable<RequestStatus> {
        return from(deleteDoc(doc(this.firestore, collectionName, id)).then(() => RequestStatus.SUCCESS).catch(() => RequestStatus.ERROR));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateDocument(collectionName: string, id: string, data: any): Observable<RequestStatus> {
        return from(updateDoc(doc(this.firestore, collectionName, id), data).then(() => RequestStatus.SUCCESS).catch(() => RequestStatus.ERROR));
    }
}
