import { Component, OnDestroy, PLATFORM_ID } from '@angular/core';
import { Inject } from '@angular/core';
import { CommonModule, isPlatformServer } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';

import { GoogleAuthProvider, getAuth, signInWithPopup, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { loginActions } from './login.actions';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {

    errorSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    loginForm: UntypedFormGroup;
    showLoginButton = false;

    constructor(@Inject(PLATFORM_ID) platformId: object, private _router: Router, private _store: Store, private _fb: FormBuilder) {
        if (!isPlatformServer(platformId)) {
            onAuthStateChanged(getAuth(), (user) => {
                this.showLoginButton = !user?.uid;
            });
        }
        this.loginForm = this._fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            )]],
        });
    }

    ngOnDestroy(): void {
        this.errorSubject$.next(false);
        this.errorSubject$.complete();
    }

    async createWithEmailPassword() {
        if (this.loginForm?.valid) {
            createUserWithEmailAndPassword(getAuth(), this.loginForm?.get('email')?.value, this.loginForm?.get('password')?.value)
                .then((result) => {
                    const user = { ...result?.user?.providerData?.[0] };
                    this._store.dispatch(loginActions.loginSuccess({ user }));
                    this.errorSubject$.next(false);
                    this._router.navigate(['/']);
                }).catch((error) => {
                    this._store.dispatch(loginActions.loginFailed({ error }));
                    this.errorSubject$.next(true);
                });
        }
    }

    async loginWithEmailPassword() {
        if (this.loginForm?.valid) {
            signInWithEmailAndPassword(getAuth(), this.loginForm?.get('email')?.value, this.loginForm?.get('password')?.value)
                .then((result) => {
                    const user = { ...result?.user?.providerData?.[0] };
                    this._store.dispatch(loginActions.loginSuccess({ user }));
                    this.errorSubject$.next(false);
                    this._router.navigate(['/']);
                }).catch((error) => {
                    this._store.dispatch(loginActions.loginFailed({ error }));
                    this.errorSubject$.next(true);
                });
        }
    }

    async loginWithGoogle() {
        signInWithPopup(getAuth(), new GoogleAuthProvider())
            .then((result) => {
                const user = { ...result?.user?.providerData?.[0] };
                this._store.dispatch(loginActions.loginSuccess({ user }));
                this.errorSubject$.next(false);
                this._router.navigate(['/']);
            }).catch((error) => {
                this._store.dispatch(loginActions.loginFailed({ error }));
                this.errorSubject$.next(true);
            });
    }

}
