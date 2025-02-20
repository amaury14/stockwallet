import { UserInfo } from "firebase/auth";
import { createActionGroup, emptyProps, props } from "@ngrx/store";

export const authEffectsActions = createActionGroup({
    source: 'Auth Effects',
    events: {
        userLoggedIn: props<{ user: UserInfo | null }>(),
        userLoggedOut: emptyProps()
    }
});
