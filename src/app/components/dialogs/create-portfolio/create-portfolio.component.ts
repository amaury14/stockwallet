import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, Signal, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

import { dialogsSelectors } from '../../../store/dialogs/dialogs.selector';
import { createPortfolioActions } from './create-portfolio.actions';

@Component({
    selector: 'app-create-portfolio-dialog',
    imports: [
        ButtonModule,
        CommonModule,
        DialogModule,
        FormsModule,
        IftaLabelModule,
        InputTextModule,
        ReactiveFormsModule,
        TextareaModule
    ],
    templateUrl: './create-portfolio.component.html',
    styleUrls: ['./create-portfolio.component.scss']
})
export class CreatePortfolioDialogComponent implements OnInit {

    portfolioForm!: UntypedFormGroup;
    showPortfolioDialog = signal(false);
    showPortfolioDialog$: Signal<boolean> = signal(false);

    private _portfolioFormValue = {
        name: [null, Validators.required],
        description: ''
    };

    constructor(private _store: Store, private _fb: UntypedFormBuilder) {
        effect(() => {
            this.showPortfolioDialog.set(this.showPortfolioDialog$());
        });
    }

    ngOnInit(): void {
        this.showPortfolioDialog$ = this._store.selectSignal(dialogsSelectors.showPortfolioDialog);
        this.portfolioForm = this._fb.group(this._portfolioFormValue);
    }

    onPortfolioCancelClicked(): void {
        this._store.dispatch(createPortfolioActions.showPortfolioDialogUpdated({ data: false }));
        this.portfolioForm.reset();
    }

    onPortfolioSaveClicked(): void {
        if (this.portfolioForm.valid) {
            this._store.dispatch(createPortfolioActions.showPortfolioDialogUpdated({ data: false }));
            this._store.dispatch(createPortfolioActions.portfolioSaved({
                data: {
                    createdAt: new Date(),
                    name: this.portfolioForm.get('name')?.value,
                    description: this.portfolioForm.get('description')?.value
                }
            }));
            this.portfolioForm.reset();
        }
    }
}
