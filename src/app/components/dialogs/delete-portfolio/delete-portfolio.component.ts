import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, signal, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { interval, Subscription, take } from 'rxjs';

import { Portfolio } from '../../../store/portfolio/models';
import { portfolioSelectors } from '../../../store/portfolio/portfolio.selector';
import { dialogsSelectors } from '../../../store/dialogs/dialogs.selector';
import { deletePortfolioActions } from './delete-portfolio.actions';

@Component({
    selector: 'app-delete-portfolio',
    imports: [
        ButtonModule,
        CommonModule,
        DialogModule
    ],
    templateUrl: './delete-portfolio.component.html',
    styleUrls: ['./delete-portfolio.component.scss']
})
export class DeletePortfolioComponent implements OnInit {

    countdown = 5; // Timer duration in seconds
    isPortfolioDeleteDisabled = signal(false);
    isPortfolioDeleteDisabled$: Signal<boolean> = signal(false);
    portfolioDeleteTimerSubscription$: Subscription | null = null;
    portfolioSelected: Signal<Portfolio | null> = signal(null);
    showPortfolioDeleteDialog = signal(false);
    showPortfolioDeleteDialog$: Signal<boolean> = signal(false);

    constructor(private _store: Store) {
        effect(() => {
            this.showPortfolioDeleteDialog.set(this.showPortfolioDeleteDialog$());
        });
        effect(() => {
            if (this.showPortfolioDeleteDialog()) {
                this._startDeleteTimer();
            }
        });
    }

    ngOnInit(): void {
        this.portfolioSelected = this._store.selectSignal(portfolioSelectors.getSelected);
        this.showPortfolioDeleteDialog$ = this._store.selectSignal(dialogsSelectors.showPortfolioDeleteDialog);
    }

    onPortfolioDeleteCancelClicked(): void {
        this._store.dispatch(deletePortfolioActions.showPortfolioDeleteDialogUpdated({ data: false }));
        this.portfolioDeleteTimerSubscription$?.unsubscribe();
        this._resetDeleteProps();
    }

    onPortfolioDeleteOkClicked(): void {
        this._store.dispatch(deletePortfolioActions.portfolioDeleted({ data: this.portfolioSelected()! }));
        this._store.dispatch(deletePortfolioActions.showPortfolioDeleteDialogUpdated({ data: false }));
    }

    private _resetDeleteProps(): void {
        this.isPortfolioDeleteDisabled.set(true);
        this.countdown = 5; // Reset countdown
    }

    private _startDeleteTimer(): void {
        this._resetDeleteProps();
        this.portfolioDeleteTimerSubscription$ = interval(1000)
            .pipe(take(this.countdown)) // Run for 5 seconds
            .subscribe({
                next: (val) => this.countdown = 5 - (val + 1),
                complete: () => this.isPortfolioDeleteDisabled.set(false)
            });
    }
}
