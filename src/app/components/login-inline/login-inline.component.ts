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
                this._toastService.showToast('¡El correo electrónico de restablecimiento se envió correctamente!', 'success', 'Información', 5000);
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
        this._toastService.showToast('¡Ha habido un fallo, intente de nuevo!', 'error', 'Error', 3000);
    }

    private _success(): void {
        this.loading.set(false);
        this._toastService.showToast('¡Logueado correctamente!', 'success', 'Información', 3000);
    }

    private _checkLoginForm(): void {
        const messages = [];
        if (this.loginForm.get('email')?.touched) {
            if (this.loginForm.get('email')?.hasError('required')) {
                messages.push('Se requiere correo electrónico.');
            }
            if (this.loginForm.get('email')?.hasError('email')) {
                messages.push('Por favor, introduce una dirección de correo electrónico válida.');
            }
        }
        if (this.loginForm.get('password')?.touched) {
            if (this.loginForm.get('password')?.hasError('required')) {
                messages.push('Se requiere contraseña.');
            }
            if (this.loginForm.get('password')?.hasError('minlength')) {
                messages.push('La contraseña debe tener al menos 8 caracteres.');
            }
            if (this.loginForm.get('password')?.hasError('pattern')) {
                messages.push('La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un carácter especial.');
            }
        }
        if (messages?.length) {
            this._toastService.showToast(messages.join('<br>'), 'error', 'Errores', 8000);
        }
    }

}
