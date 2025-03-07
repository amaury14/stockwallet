import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, signal, Signal } from '@angular/core';
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

import { dialogsSelectors } from '../../../store/dialogs/dialogs.selector';
import { holdingsSelectors } from '../../../store/holdings/holdings.selector';
import { Holding } from '../../../store/holdings/models';
import { holdingDefaultEditFormValue } from '../register-purchase/register-purchase.metadata';
import { updateContributionsActions } from './update-contributions.actions';

@Component({
    selector: 'app-update-contributions',
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
        SkeletonModule,
        ToolbarModule,
        TooltipModule
    ],
    templateUrl: './update-contributions.component.html',
    styleUrls: ['./update-contributions.component.scss']
})
export class UpdateContributionsComponent implements OnInit {

    editHoldingItemForm!: UntypedFormGroup;
    selectedHoldings: Signal<Holding[]> = signal([]);
    showEditHoldingDialog = signal(false);
    showEditHoldingDialog$: Signal<boolean> = signal(false);

    constructor(private _store: Store, private _fb: UntypedFormBuilder) {
        effect(() => {
            this.showEditHoldingDialog.set(this.showEditHoldingDialog$());
        });
        effect(() => {
            if (this.showEditHoldingDialog()) {
                this.editHoldingItemForm = this._fb.group(holdingDefaultEditFormValue);
            }
        });
    }

    ngOnInit(): void {
        this.showEditHoldingDialog$ = this._store.selectSignal(dialogsSelectors.showEditHoldingDialog);
        this.selectedHoldings = this._store.selectSignal(holdingsSelectors.getSelectedHoldings);
        this.editHoldingItemForm = this._fb.group(holdingDefaultEditFormValue);
    }

    onEditHoldingCancel(): void {
        this.editHoldingItemForm = this._fb.group(holdingDefaultEditFormValue);
        this._store.dispatch(updateContributionsActions.showEditHoldingDialogUpdated({ data: false }));
    }

    onEditHoldingItemClicked(data: Holding): void {
        this.editHoldingItemForm = this._fb.group({
            id: [{ value: data.id, disabled: true }, Validators.required],
            ticker: [{ value: data.ticker, disabled: true }, Validators.required],
            shares: [data.shares, Validators.required],
            dateOfPurchase: [{ value: new Date(data.dateOfPurchase as Date), disabled: false }, Validators.required],
            price: [{ value: data.price, disabled: true }, Validators.required],
            notes: [{ value: data.notes, disabled: false }]
        });
    }

    onTransactionDeleteClicked(): void {
        if (this.editHoldingItemForm.valid) {
            this._store.dispatch(updateContributionsActions.transactionDeleted({
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
            this._store.dispatch(updateContributionsActions.transactionUpdated({
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
}
