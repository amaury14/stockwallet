import { createActionGroup, props } from '@ngrx/store';
import { UserInfo } from 'firebase/auth';

export const loginInlineActions = createActionGroup({
    source: 'Login Inline Component',
    events: {
        loginFailed: props<{ error: unknown }>(),
        loginSuccess: props<{ user: UserInfo | null }>()
    }
});

