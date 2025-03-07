import { CommonModule } from '@angular/common';
import { Component, effect, OnDestroy, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { dialogsSelectors } from '../../../store/dialogs/dialogs.selector';
import { holdingsSelectors } from '../../../store/holdings/holdings.selector';
import { Holding } from '../../../store/holdings/models';
import { calculateContributionActions } from './calculate-contribution.actions';

@Component({
    selector: 'app-calculate-contribution',
    imports: [
        ButtonModule,
        CommonModule,
        DialogModule,
        FloatLabelModule,
        InputNumberModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        ToastModule,
        TooltipModule
    ],
    providers: [MessageService],
    templateUrl: './calculate-contribution.component.html',
    styleUrls: ['./calculate-contribution.component.scss']
})
export class CalculateContributionComponent implements OnInit, OnDestroy {

    amount = signal(0);
    holdings: WritableSignal<Holding[]> = signal([]);
    holdings$: Signal<Holding[]> = signal([]);
    selectedTicker: WritableSignal<Holding[]> = signal([]);
    showCalculateContributionDialog = signal(false);
    showCalculateContributionDialog$: Signal<boolean> = signal(false);

    constructor(private _store: Store, private _fb: UntypedFormBuilder, private _messageService: MessageService) {
        effect(() => {
            this.holdings.set(this.holdings$());
            this.selectedTicker.set(this.holdings$());
        });
        effect(() => {
            this.showCalculateContributionDialog.set(this.showCalculateContributionDialog$());
        });
        effect(() => {
            if (this.showCalculateContributionDialog()) {
                this.amount.set(0);
            } else {
                this._messageService.clear();
            }
        });
    }

    ngOnInit(): void {
        this.holdings$ = this._store.selectSignal(holdingsSelectors.getAggregatedHoldings);
        this.showCalculateContributionDialog$ = this._store.selectSignal(dialogsSelectors.showCalculateContributionDialog);
    }

    ngOnDestroy(): void {
        this._messageService.clear();
    }

    onCalculateClicked(): void {
        const isPercentageOk = this.selectedTicker().reduce((sum, item) => sum + item.percent!, 0) <= 100;
        if (this.amount() > 0 && this.selectedTicker().length > 0 && isPercentageOk) {
            const updatedHoldings = this.holdings().map(item => {
                if (this.selectedTicker()?.find(ticker => ticker.symbol === item.symbol)) {
                    return ({ ...item, investAmount: (item.percent! / 100) * this.amount() });
                }
                return ({ ...item, investAmount: 0 });
            })
            this.holdings.set(updatedHoldings);
        } else {
            this._messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: 'The amount must be greater than 0. At least one row must be selected. Percentages must be limited to 100%. Please update the data.',
                sticky: true
            });
        }
    }

    onCloseClicked(): void {
        this._store.dispatch(calculateContributionActions.showCalculateContributionDialogUpdated({ data: false }));
    }
}
