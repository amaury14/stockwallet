import { Injectable } from '@angular/core';
import { DocumentData, DocumentReference, Firestore, WhereFilterOp, addDoc, collection, deleteDoc, doc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Analytics, getAnalytics } from 'firebase/analytics';
import { Auth, getAuth } from 'firebase/auth';
import { Observable, from, of } from 'rxjs';

import { environment } from '../../environments/environment';
import { RequestStatus } from './models';

@Injectable({
    providedIn: 'root',
})
export class FirebaseService {
    public analytics: Analytics;
    public app: FirebaseApp;
    public auth: Auth;
    public firestore: Firestore;

    constructor() {
        this.app = initializeApp(environment.firebaseConfig);
        this.analytics = getAnalytics(this.app);
        this.auth = getAuth(this.app);
        // Initialize Cloud Firestore and get a reference to the service
        this.firestore = getFirestore(this.app);
    }

    initializeApp(): void {
        this.app = initializeApp(environment.firebaseConfig);
        this.analytics = getAnalytics(this.app);
        this.auth = getAuth(this.app);
        // Initialize Cloud Firestore and get a reference to the service
        this.firestore = getFirestore(this.app);
    }

    getDocuments(collectionName: string): Observable<DocumentData[] | RequestStatus> {
        if (this.auth?.currentUser) {
            return from(
                getDocs(
                    query(
                        collection(this.firestore, collectionName)
                    )
                ).then(item => item?.docs?.map((doc) =>
                    ({ id: doc.id, ...doc.data() }))
                ).catch(() => RequestStatus.ERROR)
            );
        } else {
            return of([]);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addDocument(collectionName: string, data: any): Observable<DocumentReference<any> | RequestStatus> {
        if (this.auth?.currentUser) {
            return from(
                addDoc(
                    collection(this.firestore, collectionName), data
                ).then((data) => data).catch(() => RequestStatus.ERROR));
        } else {
            return of(RequestStatus.ERROR);
        }
    }

    deleteDocument(collectionName: string, id: string): Observable<RequestStatus> {
        if (this.auth?.currentUser) {
            return from(
                deleteDoc(
                    doc(this.firestore, collectionName, id)
                ).then(() => RequestStatus.SUCCESS
                ).catch(() => RequestStatus.ERROR));
        } else {
            return of(RequestStatus.ERROR);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateDocument(collectionName: string, id: string, data: any): Observable<RequestStatus> {
        if (this.auth?.currentUser) {
            return from(
                updateDoc(
                    doc(this.firestore, collectionName, id), data
                ).then(() => RequestStatus.SUCCESS
                ).catch(() => RequestStatus.ERROR));
        } else {
            return of(RequestStatus.ERROR);
        }
    }

    // The operation string (e.g "<", "<=", "==", "<", "<=", "!=").
    getDocumentsByField(collectionName: string, field: string, operation: WhereFilterOp, value: unknown): Observable<DocumentData[] | RequestStatus> {
        if (this.auth?.currentUser) {
            return from(
                getDocs(
                    query(
                        collection(this.firestore, collectionName),
                        where(field, operation, value)
                    )
                ).then(item => item?.docs?.map((doc) =>
                    ({ id: doc.id, ...doc.data() }))
                ).catch(() => RequestStatus.ERROR)
            );
        } else {
            return of([]);
        }
    }
}
