import { Component, PLATFORM_ID, signal } from '@angular/core';
import { Inject } from '@angular/core';
import { CommonModule, isPlatformServer } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail
} from 'firebase/auth';
import { Store } from '@ngrx/store';

import { ToastService } from '../../store/toast.service';
import { UiLoaderComponent } from '../shared/ui-loader/ui-loader.component';
import { loginInlineActions } from './login-inline.actions';

@Component({
    selector: 'app-login-inline',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        UiLoaderComponent
    ],
    templateUrl: './login-inline.component.html',
    styleUrls: ['./login-inline.component.scss']
})
export class LoginInlineComponent {

    loading = signal(false);
    loginForm: UntypedFormGroup;
    showLogin = signal(false);

    constructor(
        @Inject(PLATFORM_ID) platformId: object,
        private _store: Store,
        private _fb: FormBuilder,
        private _toastService: ToastService
    ) {
        if (!isPlatformServer(platformId)) {
            onAuthStateChanged(getAuth(), (user) => {
                this.showLogin.set(!user?.uid);
            });
        }
        this.loginForm = this._fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            )]],
        });
    }

    async createWithEmailPassword() {
        this._checkLoginForm();
        if (this.loginForm?.valid) {
            this.loading.set(true);
            createUserWithEmailAndPassword(getAuth(), this.loginForm?.get('email')?.value, this.loginForm?.get('password')?.value)
                .then((result) => {
                    const user = { ...result?.user?.providerData?.[0] };
                    this._success();
                    this._store.dispatch(loginInlineActions.loginSuccess({ user }));
                }).catch((error) => {
                    this._error();
                    this._store.dispatch(loginInlineActions.loginFailed({ error }));
                });
        }
    }

    async loginWithEmailPassword() {
        this._checkLoginForm();
        if (this.loginForm?.valid) {
            this.loading.set(true);
            signInWithEmailAndPassword(getAuth(), this.loginForm?.get('email')?.value, this.loginForm?.get('password')?.value)
                .then((result) => {
                    const user = { ...result?.user?.providerData?.[0] };
                    this._success();
                    this._store.dispatch(loginInlineActions.loginSuccess({ user }));
                }).catch((error) => {
                    this._error();
                    this._store.dispatch(loginInlineActions.loginFailed({ error }));
                });
        }
    }

    async loginWithGoogle() {
        this.loading.set(true);
        signInWithPopup(getAuth(), new GoogleAuthProvider())
            .then((result) => {
                const user = { ...result?.user?.providerData?.[0] };
                this._success();
                this._store.dispatch(loginInlineActions.loginSuccess({ user }));
            }).catch((error) => {
                this._error();
                this._store.dispatch(loginInlineActions.loginFailed({ error }));
            });
    }

    async sendPasswordResetEmail() {
        this.loginForm.get('password')?.markAsUntouched();
        this._checkLoginForm();
        if (this.loginForm.get('email')?.valid) {
            this.loading.set(true);
            const email = this.loginForm.value.email;
            sendPasswordResetEmail(getAuth(), email).then(() => {
                this._toastService.showToast('The reset email was sent successfully!', 'success', 'Information', 5000);
                this.loginForm.get('password')?.markAsTouched();
                this.loading.set(false);
            }).catch(() => {
                this._error();
                this.loading.set(false);
            });
        }
    }

    private _error(): void {
        this.loading.set(false);
        this._toastService.showToast('There was an error, please try again!', 'error', 'Error', 3000);
    }

    private _success(): void {
        this.loading.set(false);
        this._toastService.showToast('Logged in successfully!', 'success', 'Information', 3000);
    }

    private _checkLoginForm(): void {
        const messages = [];
        if (this.loginForm.get('email')?.touched) {
            if (this.loginForm.get('email')?.hasError('required')) {
                messages.push('Email is required.');
            }
            if (this.loginForm.get('email')?.hasError('email')) {
                messages.push('Please enter a valid email address.');
            }
        }
        if (this.loginForm.get('password')?.touched) {
            if (this.loginForm.get('password')?.hasError('required')) {
                messages.push('Password required.');
            }
            if (this.loginForm.get('password')?.hasError('minlength')) {
                messages.push('The password must be at least 8 characters.');
            }
            if (this.loginForm.get('password')?.hasError('pattern')) {
                messages.push('The password must contain at least one uppercase letter, one lowercase letter and one special character.');
            }
        }
        if (messages?.length) {
            this._toastService.showToast(messages.join('<br>'), 'error', 'Errors', 8000);
        }
    }

}
