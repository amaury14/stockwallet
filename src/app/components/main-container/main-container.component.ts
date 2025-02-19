import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { mainContainerActions } from './main-container.actions';

@Component({
    selector: 'app-main-container',
    imports: [
        ButtonModule,
        CardModule,
        CommonModule,
        HeaderComponent,
        SidebarComponent
    ],
    templateUrl: './main-container.component.html',
    styleUrls: ['./main-container.component.scss']
})
export class MainContainerComponent implements OnInit {

    constructor(private _store: Store) { }

    ngOnInit(): void {
        this._store.dispatch(mainContainerActions.ldStarted());
    }
}
