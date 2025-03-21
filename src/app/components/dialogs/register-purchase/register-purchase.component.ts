import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, signal, Signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { AutoFocusModule } from 'primeng/autofocus';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';

import { dialogsSelectors } from '../../../store/dialogs/dialogs.selector';
import { investmentTypes } from '../../../store/holdings/holdings.metadata';
import { Holding } from '../../../store/holdings/models';
import { holdingsSelectors } from '../../../store/holdings/holdings.selector';
import { StockInformation } from '../../../store/models';
import { holdingDefaultFormValue, holdingDefaultValue } from './register-purchase.metadata';
import { registerPurchaseActions } from './register-purchase.actions';

@Component({
    selector: 'app-register-purchase',
    imports: [
        AutoCompleteModule,
        AutoFocusModule,
        ButtonModule,
        CommonModule,
        DatePickerModule,
        DialogModule,
        FloatLabelModule,
        FormsModule,
        IftaLabelModule,
        InputMaskModule,
        InputNumberModule,
        InputTextModule,
        RadioButtonModule,
        ReactiveFormsModule,
        TextareaModule,
        TooltipModule
    ],
    templateUrl: './register-purchase.component.html',
    styleUrls: ['./register-purchase.component.scss']
})
export class RegisterPurchaseComponent implements OnInit {

    filteredStocks: Signal<StockInformation[]> = signal([]);
    holdingForm!: UntypedFormGroup;
    investmentTypesArray = investmentTypes;
    isEditing = signal(false);
    selectedHolding: Signal<Holding | null> = signal(null);
    showHoldingDialog = signal(false);
    showHoldingDialog$: Signal<boolean> = signal(false);

    constructor(private _store: Store, private _fb: UntypedFormBuilder) {
        effect(() => {
            this.showHoldingDialog.set(this.showHoldingDialog$());
        });
        effect(() => {
            if (this.showHoldingDialog$() && !!this.selectedHolding()) {
                this.isEditing.set(true);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { id, ...holding } = this.selectedHolding()!;
                this.holdingForm.get('ticker')?.patchValue(holding);
                this.holdingForm.updateValueAndValidity();
            }
        });
    }

    ngOnInit(): void {
        this.filteredStocks = this._store.selectSignal(holdingsSelectors.getFilteredStocks);
        this.showHoldingDialog$ = this._store.selectSignal(dialogsSelectors.showHoldingDialog);
        this.selectedHolding = this._store.selectSignal(holdingsSelectors.getSelectedHolding);

        this.holdingForm = this._fb.group(holdingDefaultFormValue);
    }

    filterByTicker(event: AutoCompleteCompleteEvent): void {
        this._store.dispatch(registerPurchaseActions.filterTicker({ query: event.query?.toUpperCase() }));
    }

    onHoldingCancelClicked(): void {
        this._store.dispatch(registerPurchaseActions.showHoldingDialogUpdated({ data: false }));
        this.holdingForm.reset(holdingDefaultValue);
        this.isEditing.set(false);
    }

    onHoldingSaveClicked(): void {
        if (this.holdingForm.valid) {
            this._store.dispatch(registerPurchaseActions.showHoldingDialogUpdated({ data: false }));
            this._store.dispatch(registerPurchaseActions.holdingSaved({
                data: {
                    ...this.holdingForm.get('ticker')?.value,
                    dateOfPurchase: this.holdingForm.get('dateOfPurchase')?.value,
                    ticker: this.holdingForm.get('ticker')?.value?.symbol,
                    shares: this.holdingForm.get('shares')?.value,
                    price: this.holdingForm.get('price')?.value,
                    investmentType: this.holdingForm.get('investmentType')?.value,
                    notes: this.holdingForm.get('notes')?.value
                }
            }));
            this.holdingForm.reset(holdingDefaultValue);
            this.isEditing.set(false);
        }
    }
}
