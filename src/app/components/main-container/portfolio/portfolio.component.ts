import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, Signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { AutoFocusModule } from 'primeng/autofocus';
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
import { MeterGroupModule } from 'primeng/metergroup';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { interval, Subscription, take } from 'rxjs';

import { holdingsSelectors } from '../../../store/holdings/holdings.selector';
import { Holding } from '../../../store/holdings/models';
import { PortfolioPieData, PortfolioStats, ShareType, StockInformation } from '../../../store/models';
import { Portfolio } from '../../../store/portfolio/models';
import { portfolioSelectors } from '../../../store/portfolio/portfolio.selector';
import { UiLoaderComponent } from '../../shared/ui-loader/ui-loader.component';
import { portfolioActions } from './portfolio.actions';
import { holdingDefaultEditFormValue, holdingDefaultFormValue, holdingDefaultValue, portfolioFormValue } from './portfolio.metadata';

@Component({
    selector: 'app-portfolio',
    imports: [
        AutoCompleteModule,
        AutoFocusModule,
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
        MeterGroupModule,
        ReactiveFormsModule,
        TableModule,
        TextareaModule,
        ChartModule,
        PanelModule,
        ToolbarModule,
        TooltipModule,
        UiLoaderComponent
    ],
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {

    countdown = 5; // Timer duration in seconds
    editHoldingItemForm!: UntypedFormGroup;
    filteredStocks: Signal<StockInformation[]> = signal([]);
    holdings: Signal<Holding[]> = signal([]);
    holdingForm!: UntypedFormGroup;
    isHoldingsLoading: Signal<boolean> = signal(false);
    isLoading: Signal<boolean> = signal(false);
    isPortfolioDeleteDisabled = signal(false);
    pieChartHoldingsByAmount: Signal<PortfolioPieData | null> = signal(null);
    pieChartHoldingsByPercent: Signal<PortfolioPieData | null> = signal(null);
    portfolio: Signal<Portfolio[]> = signal([]);
    portfolioDeleteTimerSubscription$: Subscription | null = null;
    portfolioForm!: UntypedFormGroup;
    portfolioSelected: Signal<Portfolio | null> = signal(null);
    portfolioStats: Signal<PortfolioStats | null> = signal(null);
    shareTypes: Signal<ShareType[]> = signal([]);
    selectedHoldings: Signal<Holding[]> = signal([]);
    showEditHoldingDialog = signal(false);
    showHoldingDialog = signal(false);
    showPortfolioDeleteDialog = signal(false);
    showPortfolioDialog = signal(false);

    pieChartOptions = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: 'white'
                }
            }
        }
    };
    // lineData = {
    //     labels: ['Jan', 'Feb', 'Mar'],
    //     datasets: [
    //         { label: 'Portfolio Value', data: [24000, 25000, 25500], borderColor: '#42A5F5', fill: false }
    //     ]
    // };

    constructor(private _store: Store, private _fb: UntypedFormBuilder) { }

    ngOnInit(): void {
        this.portfolio = this._store.selectSignal(portfolioSelectors.getData);
        this.isHoldingsLoading = this._store.selectSignal(holdingsSelectors.isLoading);
        this.isLoading = this._store.selectSignal(portfolioSelectors.isLoading);
        this.portfolioSelected = this._store.selectSignal(portfolioSelectors.getSelected);
        this.holdings = this._store.selectSignal(holdingsSelectors.getAggregatedHoldings);
        this.selectedHoldings = this._store.selectSignal(holdingsSelectors.getSelectedHoldings);
        this.filteredStocks = this._store.selectSignal(holdingsSelectors.getFilteredStocks);
        this.pieChartHoldingsByAmount = this._store.selectSignal(holdingsSelectors.getPieChartHoldingsByAmount);
        this.pieChartHoldingsByPercent = this._store.selectSignal(holdingsSelectors.getPieChartHoldingsByPercent);
        this.portfolioStats = this._store.selectSignal(holdingsSelectors.getPortfolioStats);
        this.shareTypes = this._store.selectSignal(holdingsSelectors.getAggregatedShareTypes);
        this._initializeForms();
    }

    filterByTicker(event: AutoCompleteCompleteEvent): void {
        this._store.dispatch(portfolioActions.filterTicker({ query: event.query }));
    }

    onAddClicked(): void {
        this.showPortfolioDialog.set(true);
    }

    onEditHoldingClicked(data: Holding): void {
        this._store.dispatch(portfolioActions.holdingEditSelected({ data }));
        this.editHoldingItemForm = this._fb.group(holdingDefaultEditFormValue);
        this.showEditHoldingDialog.set(true);
    }

    onEditHoldingCancel(): void {
        this.editHoldingItemForm = this._fb.group(holdingDefaultEditFormValue);
        this.showEditHoldingDialog.set(false);
    }

    onEditHoldingItemClicked(data: Holding): void {
        this.editHoldingItemForm = this._fb.group({
            id: [{ value: data.id, disabled: true }, Validators.required],
            ticker: [{ value: data.ticker, disabled: true }, Validators.required],
            shares: [data.shares, Validators.required],
            dateOfPurchase: [{ value: new Date(data.dateOfPurchase as Date), disabled: true }, Validators.required],
            price: [{ value: data.price, disabled: true }, Validators.required],
            notes: [{ value: data.notes, disabled: false }]
        });
    }

    onHoldingAddClicked(): void {
        this.showHoldingDialog.set(true);
    }

    onHoldingCancelClicked(): void {
        this.showHoldingDialog.set(false);
        this.holdingForm.reset(holdingDefaultValue);
    }

    onHoldingSaveClicked(): void {
        if (this.holdingForm.valid) {
            this.showHoldingDialog.set(false);
            this._store.dispatch(portfolioActions.holdingSaved({
                data: {
                    ...this.holdingForm.get('ticker')?.value,
                    dateOfPurchase: this.holdingForm.get('dateOfPurchase')?.value,
                    ticker: this.holdingForm.get('ticker')?.value?.symbol,
                    shares: this.holdingForm.get('shares')?.value,
                    price: this.holdingForm.get('price')?.value,
                    notes: this.holdingForm.get('notes')?.value
                }
            }));
            this.holdingForm.reset(holdingDefaultValue);
        }
    }

    onPortfolioDeleteCancelClicked(): void {
        this.showPortfolioDeleteDialog.set(false);
        this.portfolioDeleteTimerSubscription$?.unsubscribe();
        this._resetDeleteProps();
    }

    onPortfolioDeleteClicked(): void {
        this.showPortfolioDeleteDialog.set(true);
        this._startDeleteTimer();
    }

    onPortfolioDeleteOkClicked(): void {
        this._store.dispatch(portfolioActions.portfolioDeleted({ data: this.portfolioSelected()! }));
        this.showPortfolioDeleteDialog.set(false);
    }

    onPortfolioCancelClicked(): void {
        this.showPortfolioDialog.set(false);
        this.portfolioForm.reset();
    }

    onPortfolioSelected(data: Portfolio): void {
        this._store.dispatch(portfolioActions.portfolioSelected({ data }));
    }

    onPortfolioSaveClicked(): void {
        if (this.portfolioForm.valid) {
            this.showPortfolioDialog.set(false);
            this._store.dispatch(portfolioActions.portfolioSaved({
                data: {
                    createdAt: new Date(),
                    name: this.portfolioForm.get('name')?.value,
                    description: this.portfolioForm.get('description')?.value
                }
            }));
            this.portfolioForm.reset();
        }
    }

    onTransactionDeleteClicked(): void {
        if (this.editHoldingItemForm.valid) {
            this._store.dispatch(portfolioActions.transactionDeleted({
                data: {
                    dateOfPurchase: this.editHoldingItemForm.get('dateOfPurchase')?.value,
                    id: this.editHoldingItemForm.get('id')?.value,
                    ticker: this.editHoldingItemForm.get('ticker')?.value,
                    shares: this.editHoldingItemForm.get('shares')?.value,
                    price: this.editHoldingItemForm.get('price')?.value,
                    notes: this.editHoldingItemForm.get('notes')?.value
                }
            }));
            this.editHoldingItemForm.reset();
        }
    }

    onTransactionUpdateClicked(): void {
        if (this.editHoldingItemForm.valid) {
            this._store.dispatch(portfolioActions.transactionUpdated({
                data: {
                    dateOfPurchase: this.editHoldingItemForm.get('dateOfPurchase')?.value,
                    id: this.editHoldingItemForm.get('id')?.value,
                    ticker: this.editHoldingItemForm.get('ticker')?.value,
                    shares: this.editHoldingItemForm.get('shares')?.value,
                    price: this.editHoldingItemForm.get('price')?.value,
                    notes: this.editHoldingItemForm.get('notes')?.value
                }
            }));
            this.editHoldingItemForm = this._fb.group(holdingDefaultEditFormValue);
        }
    }

    private _initializeForms(): void {
        this.portfolioForm = this._fb.group(portfolioFormValue);
        this.holdingForm = this._fb.group(holdingDefaultFormValue);
        this.editHoldingItemForm = this._fb.group(holdingDefaultEditFormValue);
    }

    private _resetDeleteProps(): void {
        this.isPortfolioDeleteDisabled.set(true); // Disable the button
        this.countdown = 5; // Reset countdown
    }

    private _startDeleteTimer(): void {
        this._resetDeleteProps();
        this.portfolioDeleteTimerSubscription$ = interval(1000)
            .pipe(take(this.countdown)) // Run for 5 seconds
            .subscribe({
                next: (val) => this.countdown = 5 - (val + 1),
                complete: () => this.isPortfolioDeleteDisabled.set(false) // Re-enable the button
            });
    }
}
