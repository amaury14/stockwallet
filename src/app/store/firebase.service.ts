import { Injectable } from '@angular/core';
import { DocumentData, DocumentReference, Firestore, QueryConstraint, WhereFilterOp, addDoc, collection, deleteDoc, doc, getDocs, getFirestore, limit, query, updateDoc, where } from 'firebase/firestore';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Analytics, getAnalytics } from 'firebase/analytics';
import { Auth, getAuth } from 'firebase/auth';
import { Observable, from, of } from 'rxjs';

import { environment } from '../../environments/environment';
import { FilterOperators, RequestStatus } from './models';

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

    /**
     * 
     * @param collectionName - Name of the collection.
     * @returns - Data for the collection or the operation (error).
     */
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

    /**
     * 
     * @param collectionName - Name of the collection.
     * @param data - Data to add.
     * @returns - Added document or status of the operation (error).
     */
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

    /**
     * 
     * @param collectionName - Name of the collection.
     * @param id - Document id.
     * @returns - Status of the operation.
     */
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

    /**
     * 
     * @param collectionName - Name of the collection.
     * @param id - Document id.
     * @param data - Data to update.
     * @returns - Status of the operation.
     */
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

    
    /**
     * 
     * @param collectionName - Name of the collection.
     * @param field - Field to filter by.
     * @param operation - Operation. The operation string (e.g "<", "<=", "==", "<", "<=", "!=", "like"). For "like" operation pass one item in values parameter.
     * @param values - Values to filter.
     * @param maxLimit - Max amount of record to return.
     * @returns - Filtered results array.
     */
    getDocumentsByField(collectionName: string, field: string, operation: WhereFilterOp | FilterOperators, values: unknown[], maxLimit: number): Observable<DocumentData[] | RequestStatus> {
        const filters: QueryConstraint[] = operation === 'like'
            ? [
                where(field, '>=', values[0]),
                where(field, '<=', `${values[0]}\uf8ff`)
            ]
            : [where(field, operation, values)]
        if (this.auth?.currentUser) {
            return from(
                getDocs(
                    query(
                        collection(this.firestore, collectionName),
                        ...filters,
                        limit(maxLimit)
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
