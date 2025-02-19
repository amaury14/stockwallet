import { createActionGroup, props } from '@ngrx/store';
import { UserInfo } from 'firebase/auth';

export const loginActions = createActionGroup({
    source: 'LD Login Component',
    events: {
        loginFailed: props<{ error: unknown }>(),
        loginSuccess: props<{ user: UserInfo | null }>()
    }
});

