import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, Signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AutoCompleteModule } from 'primeng/autocomplete';
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
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { Subscription } from 'rxjs';

import { authSelectors } from '../../../store/auth/auth.selector';
import { holdingsSelectors } from '../../../store/holdings/holdings.selector';
import { Holding } from '../../../store/holdings/models';
import { PortfolioPieData, ShareType } from '../../../store/models';
import { Portfolio } from '../../../store/portfolio/models';
import { portfolioSelectors } from '../../../store/portfolio/portfolio.selector';
import { CreatePortfolioDialogComponent } from '../../dialogs/create-portfolio/create-portfolio.component';
import { DeletePortfolioComponent } from '../../dialogs/delete-portfolio/delete-portfolio.component';
import { RegisterPurchaseComponent } from '../../dialogs/register-purchase/register-purchase.component';
import { MainTopBarComponent } from './main-top-bar/main-top-bar.component';
import { portfolioActions } from './portfolio.actions';
import { PortfolioBarComponent } from './portfolio-bar/portfolio-bar.component';
import { holdingDefaultEditFormValue } from '../../dialogs/register-purchase/register-purchase.metadata';

@Component({
    selector: 'app-portfolio',
    imports: [
        AutoCompleteModule,
        AutoFocusModule,
        ButtonModule,
        CardModule,
        ChipModule,
        CommonModule,
        CreatePortfolioDialogComponent,
        DatePickerModule,
        DeletePortfolioComponent,
        DialogModule,
        FloatLabelModule,
        FormsModule,
        IftaLabelModule,
        InputMaskModule,
        InputNumberModule,
        InputTextModule,
        MainTopBarComponent,
        MeterGroupModule,
        ReactiveFormsModule,
        TableModule,
        TextareaModule,
        ChartModule,
        PanelModule,
        PortfolioBarComponent,
        RegisterPurchaseComponent,
        SkeletonModule,
        ToolbarModule,
        TooltipModule
    ],
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {

    editHoldingItemForm!: UntypedFormGroup;
    holdings: Signal<Holding[]> = signal([]);
    isHoldingsLoading: Signal<boolean> = signal(false);
    isLoading: Signal<boolean> = signal(false);
    isUserLogged: Signal<boolean> = signal(false);
    pieChartHoldingsByAmount: Signal<PortfolioPieData | null> = signal(null);
    pieChartHoldingsBySector: Signal<PortfolioPieData | null> = signal(null);
    portfolio: Signal<Portfolio[]> = signal([]);
    portfolioDeleteTimerSubscription$: Subscription | null = null;
    portfolioSelected: Signal<Portfolio | null> = signal(null);
    shareTypes: Signal<ShareType[]> = signal([]);
    selectedHoldings: Signal<Holding[]> = signal([]);
    showEditHoldingDialog = signal(false);

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

    constructor(private _store: Store, private _fb: UntypedFormBuilder) { }

    ngOnInit(): void {
        this.isUserLogged = this._store.selectSignal(authSelectors.isUserLogged);
        this.portfolio = this._store.selectSignal(portfolioSelectors.getData);
        this.isHoldingsLoading = this._store.selectSignal(holdingsSelectors.isLoading);
        this.isLoading = this._store.selectSignal(portfolioSelectors.isLoading);
        this.portfolioSelected = this._store.selectSignal(portfolioSelectors.getSelected);
        this.holdings = this._store.selectSignal(holdingsSelectors.getAggregatedHoldings);
        this.selectedHoldings = this._store.selectSignal(holdingsSelectors.getSelectedHoldings);
        this.pieChartHoldingsByAmount = this._store.selectSignal(holdingsSelectors.getPieChartHoldingsByAmount);
        this.pieChartHoldingsBySector = this._store.selectSignal(holdingsSelectors.getPieChartHoldingsBySector);
        this.shareTypes = this._store.selectSignal(holdingsSelectors.getAggregatedShareTypes);
        this._initializeForms();
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
        this.editHoldingItemForm = this._fb.group(holdingDefaultEditFormValue);
    }
}
