import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, Signal, ViewChild, WritableSignal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';
import { ToolbarModule } from 'primeng/toolbar';

import { authSelectors } from '../../../../store/auth/auth.selector';
import { Portfolio } from '../../../../store/portfolio/models';
import { portfolioSelectors } from '../../../../store/portfolio/portfolio.selector';
import { portfolioBarActions } from './portfolio-bar.actions';

@Component({
    selector: 'app-portfolio-bar',
    imports: [
        ButtonModule,
        ChipModule,
        CommonModule,
        ContextMenuModule,
        SkeletonModule,
        ToolbarModule
    ],
    templateUrl: './portfolio-bar.component.html',
    styleUrls: ['./portfolio-bar.component.scss']
})
export class PortfolioBarComponent implements OnInit {

    isLoading: Signal<boolean> = signal(false);
    isUserLogged: Signal<boolean> = signal(false);
    items: MenuItem[] = [
        {
            label: 'Copy/Merge Portfolio(s)',
            icon: 'pi pi-copy',
            command: () => {
                this._store.dispatch(portfolioBarActions.showCopyMergePortfoliosDialogUpdated({ data: true }));
                this._store.dispatch(portfolioBarActions.copyMergePortfolioSelected({ data: this.menuPortfolioSelected()! }));
            }
        }
    ];
    menuPortfolioSelected: WritableSignal<Portfolio | null> = signal(null);
    portfolios: Signal<Portfolio[]> = signal([]);
    portfolioSelected: Signal<Portfolio | null> = signal(null);

    @ViewChild('cm') cm: ContextMenu | undefined;

    constructor(private _store: Store) { }

    ngOnInit(): void {
        this.isUserLogged = this._store.selectSignal(authSelectors.isUserLogged);
        this.portfolios = this._store.selectSignal(portfolioSelectors.getData);
        this.isLoading = this._store.selectSignal(portfolioSelectors.isLoading);
        this.portfolioSelected = this._store.selectSignal(portfolioSelectors.getSelected);
    }

    onAddClicked(): void {
        this._store.dispatch(portfolioBarActions.showPortfolioDialogUpdated({ data: true }));
    }

    onContextMenuClicked(event: MouseEvent, item: Portfolio): void {
        this.menuPortfolioSelected.set(item);
        this.cm?.show(event);
    }

    onContextMenuHideClicked(): void {
        this.menuPortfolioSelected.set(null);
    }

    onPortfolioSelected(data: Portfolio): void {
        this._store.dispatch(portfolioBarActions.portfolioSelected({ data }));
    }
}
