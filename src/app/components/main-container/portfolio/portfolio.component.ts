import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { TableModule } from 'primeng/table';

import { Portfolio } from '../../../store/portfolio/models';
import { portfolioSelectors } from '../../../store/portfolio/portfolio.selector';

@Component({
    selector: 'app-portfolio',
    imports: [
        CommonModule,
        TableModule
    ],
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {

    portfolio: Signal<Portfolio[]> = signal([]);
    isLoading: Signal<boolean> = signal(false);

    constructor(private _store: Store) { }

    ngOnInit(): void {
        this.portfolio = this._store.selectSignal(portfolioSelectors.getData);
        this.isLoading = this._store.selectSignal(portfolioSelectors.isLoading);
    }
}
