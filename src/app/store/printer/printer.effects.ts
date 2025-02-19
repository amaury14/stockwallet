import { Injectable } from '@angular/core';
// import { Actions, createEffect, ofType } from '@ngrx/effects';
// import { Store } from '@ngrx/store';
// import { of } from 'rxjs';
// import { catchError, map, mergeMap } from 'rxjs/operators';

// import { mainContainerActions } from '../../components/main-container/main-container.actions';
// import { PrinterModel } from '../models';
// import { printerEffectsActions } from './printer.actions';
// import { FirebaseService } from '../firebase.service';
// import { ldKeys } from '../key-string.store';
// import { DocumentReference } from 'firebase/firestore';

@Injectable()
export class PrinterEffects {

    // constructor(private _actions$: Actions, private _store: Store, private _firebaseService: FirebaseService) { }

    // loadUserInfo$ = createEffect(() => this._actions$.pipe(
    //     ofType(mainContainerActions.ldStarted),
    //     mergeMap(() =>
    //         this._firebaseService.getDocuments(ldKeys.PRINTERS_COLLECTION_KEY).pipe(
    //             map(response => printerEffectsActions.printerLoadSuccess({ printers: response as PrinterModel[] })),
    //             catchError(() =>
    //                 of(printerEffectsActions.printerAddedFailed({ error: 'Printer failed to Load' }))
    //             )
    //         )
    //     )
    // ));

    // addPrinter$ = createEffect(() => this._actions$.pipe(
    //     ofType(printerEffectsActions.mockAction),
    //     mergeMap((action) =>
    //         this._firebaseService.addDocument(ldKeys.PRINTERS_COLLECTION_KEY, action.printer).pipe(
    //             map(response => printerEffectsActions.printerAddedSuccess({ printer: { ...action.printer, id: (response as DocumentReference<any>).id } })),
    //             catchError(() =>
    //                 of(printerEffectsActions.printerAddedFailed({ error: 'Printer failed to save' }))
    //             )
    //         )
    //     )
    // ));
}
