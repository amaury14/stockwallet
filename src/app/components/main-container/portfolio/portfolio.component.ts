import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, Signal } from '@angular/core';
import { Store } from '@ngrx/store';

import { Portfolio } from '../../../store/portfolio/models';
import { portfolioSelectors } from '../../../store/portfolio/portfolio.selector';
import { CalculateContributionComponent } from '../../dialogs/calculate-contribution/calculate-contribution.component';
import { CopyMergePortfolioComponent } from '../../dialogs/copy-merge-portfolio/copy-merge-portfolio.component';
import { CreatePortfolioDialogComponent } from '../../dialogs/create-portfolio/create-portfolio.component';
import { DeletePortfolioComponent } from '../../dialogs/delete-portfolio/delete-portfolio.component';
import { RegisterPurchaseComponent } from '../../dialogs/register-purchase/register-purchase.component';
import { UpdateContributionsComponent } from '../../dialogs/update-contributions/update-contributions.component';
import { MainContentComponent } from './main-content/main-content.component';
import { MainTopBarComponent } from './main-top-bar/main-top-bar.component';
import { PortfolioBarComponent } from './portfolio-bar/portfolio-bar.component';
import { portfolioActions } from './portfolio.actions';

@Component({
    selector: 'app-portfolio',
    imports: [
        CalculateContributionComponent,
        CommonModule,
        CopyMergePortfolioComponent,
        CreatePortfolioDialogComponent,
        DeletePortfolioComponent,
        MainContentComponent,
        MainTopBarComponent,
        PortfolioBarComponent,
        RegisterPurchaseComponent,
        UpdateContributionsComponent
    ],
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {
    portfolios: Signal<Portfolio[]> = signal([]);

    constructor(private _store: Store) { }

    ngOnInit(): void {
        this.portfolios = this._store.selectSignal(portfolioSelectors.getData);
    }

    onAddClicked(): void {
        this._store.dispatch(portfolioActions.showPortfolioDialogUpdated({ data: true }));
    }
}
