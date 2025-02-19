import { Routes } from '@angular/router';

import { MainContainerComponent } from './components/main-container/main-container.component';

export const routes: Routes = [
    { path: '', redirectTo: '', pathMatch: 'full' },
    {
        path: '',
        component: MainContainerComponent
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
