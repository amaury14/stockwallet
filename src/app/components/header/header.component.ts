import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserInfo, getAuth, signOut } from 'firebase/auth';
import { ToolbarModule } from 'primeng/toolbar';

import { authSelectors } from '../../store/auth/auth.selector';
import { LoginInlineComponent } from '../login-inline/login-inline.component';
import { headerActions } from './header.actions';

@Component({
    selector: 'app-header',
    imports: [
        CommonModule,
        LoginInlineComponent,
        ToolbarModule
    ],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    user: Signal<UserInfo | null> = signal(null);
    isUserLogged: Signal<boolean | null> = signal(false);

    constructor(private _store: Store) { }

    ngOnInit(): void {
        this.user = this._store.selectSignal(authSelectors.getUser);
        this.isUserLogged = this._store.selectSignal(authSelectors.isUserLogged);
    }

    logout(): void {
        signOut(getAuth()).then(() => {
            this._store.dispatch(headerActions.singOutSuccess());
        }).catch((error) => {
            this._store.dispatch(headerActions.singOutFailed({ error }));
        });
    }

}
