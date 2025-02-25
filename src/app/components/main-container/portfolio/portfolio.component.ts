import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, Signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ChipModule } from 'primeng/chip';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { interval, Subscription, take } from 'rxjs';

import { holdingsSelectors } from '../../../store/holdings/holdings.selector';
import { Holding } from '../../../store/holdings/models';
import { Portfolio } from '../../../store/portfolio/models';
import { portfolioSelectors } from '../../../store/portfolio/portfolio.selector';
import { UiLoaderComponent } from '../../shared/ui-loader/ui-loader.component';
import { portfolioActions } from './portfolio.actions';
import { holdingDefaultFormValue, holdingDefaultValue } from './portfolio.metadata';

@Component({
    selector: 'app-portfolio',
    imports: [
        ButtonModule,
        CardModule,
        ChipModule,
        CommonModule,
        DatePickerModule,
        DialogModule,
        FloatLabelModule,
        FormsModule,
        IftaLabelModule,
        InputMaskModule,
        InputNumberModule,
        InputTextModule,
        ReactiveFormsModule,
        TableModule,
        ChartModule,
        PanelModule,
        ToolbarModule,
        UiLoaderComponent
    ],
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {

    countdown = 5; // Timer duration in seconds
    holdings: Signal<Holding[]> = signal([]);
    holdingDialogVisible = false;
    holdingForm!: UntypedFormGroup;
    portfolioForm!: UntypedFormGroup;
    isHoldingsLoading: Signal<boolean> = signal(false);
    isLoading: Signal<boolean> = signal(false);
    isPortfolioDeleteDisabled = false;
    portfolio: Signal<Portfolio[]> = signal([]);
    portfolioDeleteDialogVisible = false;
    portfolioDeleteTimerSubscription$: Subscription | null = null;
    portfolioDialogVisible = false;
    portfolioSelected: Signal<Portfolio | null> = signal(null);

    options = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: 'white'
                }
            }
        }
    };
    pieData = {
        labels: ['Stocks', 'Bonds', 'Crypto'],
        datasets: [{ data: [60, 30, 10], backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'] }]
    };
    lineData = {
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [
            { label: 'Portfolio Value', data: [24000, 25000, 25500], borderColor: '#42A5F5', fill: false }
        ]
    };

    constructor(private _store: Store, private _fb: UntypedFormBuilder) { }

    ngOnInit(): void {
        this.portfolio = this._store.selectSignal(portfolioSelectors.getData);
        this.isHoldingsLoading = this._store.selectSignal(holdingsSelectors.isLoading);
        this.isLoading = this._store.selectSignal(portfolioSelectors.isLoading);
        this.portfolioSelected = this._store.selectSignal(portfolioSelectors.getSelected);
        this.holdings = this._store.selectSignal(holdingsSelectors.getAggregatedHoldings);
        this._initializeForms();
    }

    onAddClicked(): void {
        this.portfolioDialogVisible = true;
    }

    onPortfolioDeleteClicked(): void {
        this.portfolioDeleteDialogVisible = true;
        this._startDeleteTimer();
    }

    onHoldingAddClicked(): void {
        this.holdingDialogVisible = true;
    }

    onHoldingCancelClicked(): void {
        this.holdingDialogVisible = false;
        this.holdingForm.reset();
    }

    onHoldingSaveClicked(): void {
        if (this.holdingForm.valid) {
            this.holdingDialogVisible = false;
            this._store.dispatch(portfolioActions.holdingSaved({
                data: {
                    dateOfPurchase: this.holdingForm.get('dateOfPurchase')?.value,
                    ticker: this.holdingForm.get('ticker')?.value,
                    shares: this.holdingForm.get('shares')?.value,
                    price: this.holdingForm.get('price')?.value
                }
            }));
            this.holdingForm.reset(holdingDefaultValue);
        }
    }

    onPortfolioDeleteCancelClicked(): void {
        this.portfolioDeleteDialogVisible = false;
        this.portfolioDeleteTimerSubscription$?.unsubscribe();
        this._resetDeleteProps();
    }

    onPortfolioDeleteOkClicked(): void {
        this._store.dispatch(portfolioActions.portfolioDeleted({ data: this.portfolioSelected()! }));
        this.portfolioDeleteDialogVisible = false;
    }

    onPortfolioCancelClicked(): void {
        this.portfolioDialogVisible = false;
        this.portfolioForm.reset();
    }

    onPortfolioSelected(data: Portfolio): void {
        this._store.dispatch(portfolioActions.portfolioSelected({ data }));
    }

    onPortfolioSaveClicked(): void {
        if (this.portfolioForm.valid) {
            this.portfolioDialogVisible = false;
            this._store.dispatch(portfolioActions.portfolioSaved({
                data: {
                    createdAt: new Date(),
                    name: this.portfolioForm.get('name')?.value
                }
            }));
            this.portfolioForm.reset();
        }
    }

    private _initializeForms(): void {
        this.portfolioForm = this._fb.group({ name: [null, Validators.required] });
        this.holdingForm = this._fb.group(holdingDefaultFormValue);
    }

    private _resetDeleteProps(): void {
        this.isPortfolioDeleteDisabled = true; // Disable the button
        this.countdown = 5; // Reset countdown
    }

    private _startDeleteTimer(): void {
        this._resetDeleteProps();
        this.portfolioDeleteTimerSubscription$ = interval(1000)
            .pipe(take(this.countdown)) // Run for 5 seconds
            .subscribe({
                next: (val) => this.countdown = 5 - (val + 1),
                complete: () => this.isPortfolioDeleteDisabled = false // Re-enable the button
            });
    }
}
