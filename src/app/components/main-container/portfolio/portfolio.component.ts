import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, Signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';

import { Portfolio } from '../../../store/portfolio/models';
import { portfolioSelectors } from '../../../store/portfolio/portfolio.selector';
import { UiLoaderComponent } from '../../shared/ui-loader/ui-loader.component';
import { portfolioActions } from './portfolio.actions';

@Component({
    selector: 'app-portfolio',
    imports: [
        ButtonModule,
        ChipModule,
        CommonModule,
        DialogModule,
        FormsModule,
        IftaLabelModule,
        InputTextModule,
        ReactiveFormsModule,
        ToolbarModule,
        UiLoaderComponent
    ],
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {

    form!: UntypedFormGroup;
    isLoading: Signal<boolean> = signal(false);
    portfolio: Signal<Portfolio[]> = signal([]);
    portfolioSelected: Signal<Portfolio | null> = signal(null);
    visible = false;

    constructor(private _store: Store, private _fb: UntypedFormBuilder) { }

    ngOnInit(): void {
        this.portfolio = this._store.selectSignal(portfolioSelectors.getData);
        this.isLoading = this._store.selectSignal(portfolioSelectors.isLoading);
        this.portfolioSelected = this._store.selectSignal(portfolioSelectors.getSelected);
        this._initializeForm();
    }

    onAddClicked(): void {
        this.visible = true;
    }

    onCancelClicked(): void {
        this.visible = false;
        this.form.reset();
    }

    onPortfolioSelected(data: Portfolio): void {
        this._store.dispatch(portfolioActions.portfolioSelected({ data }));
    }

    onSaveClicked(): void {
        if (this.form.valid) {
            this.visible = false;
            this._store.dispatch(portfolioActions.portfolioSaved({
                data: {
                    createdAt: new Date(),
                    name: this.form.get('name')?.value
                }
            }));
            this.form.reset();
        }
    }

    private _initializeForm(): void {
        this.form = this._fb.group({ name: [null, Validators.required] });
    }
}
