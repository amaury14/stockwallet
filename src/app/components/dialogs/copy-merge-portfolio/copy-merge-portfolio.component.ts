import { CommonModule } from '@angular/common';
import { Component, effect, OnDestroy, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { dialogsSelectors } from '../../../store/dialogs/dialogs.selector';
import { Portfolio } from '../../../store/portfolio/models';
import { portfolioSelectors } from '../../../store/portfolio/portfolio.selector';
import { copyMergePortfolioActions } from './copy-merge-portfolio.actions';

@Component({
    selector: 'app-copy-merge-portfolio',
    imports: [
        ButtonModule,
        CommonModule,
        DialogModule,
        FloatLabelModule,
        InputTextModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        ToastModule,
        TooltipModule
    ],
    providers: [MessageService],
    templateUrl: './copy-merge-portfolio.component.html',
    styleUrls: ['./copy-merge-portfolio.component.scss']
})
export class CopyMergePortfolioComponent implements OnInit, OnDestroy {

    copyMergeSelected$: Signal<Portfolio | null> = signal(null);
    description = signal('');
    name = signal('');
    portfolios: Signal<Portfolio[]> = signal([]);
    selectedPortfolios: WritableSignal<Portfolio[]> = signal([]);
    showCopyMergePortfoliosDialog = signal(false);
    showCopyMergePortfoliosDialog$: Signal<boolean> = signal(false);

    constructor(private _store: Store, private _messageService: MessageService) {
        effect(() => {
            this.showCopyMergePortfoliosDialog.set(this.showCopyMergePortfoliosDialog$());
        });
        effect(() => {
            if (this.showCopyMergePortfoliosDialog()) {
                this.name.set('');
                this.description.set('');
            } else {
                this._messageService.clear();
            }
        });
        effect(() => {
            this.selectedPortfolios.set(this.copyMergeSelected$() ? [this.copyMergeSelected$()!] : []);
        });
    }

    isCopyMergeDisabled = () => this.selectedPortfolios().length < 1 || this.name().length === 0 || this.description().length === 0;

    ngOnInit(): void {
        this.showCopyMergePortfoliosDialog$ = this._store.selectSignal(dialogsSelectors.showCopyMergePortfoliosDialog);
        this.portfolios = this._store.selectSignal(portfolioSelectors.getData);
        this.copyMergeSelected$ = this._store.selectSignal(portfolioSelectors.getCopyMergeSelected);
    }

    ngOnDestroy(): void {
        this._messageService.clear();
    }

    onCloseClicked(): void {
        this._store.dispatch(copyMergePortfolioActions.showCopyMergePortfoliosDialogUpdated({ data: false }));
    }

    onCopyMergeClicked(): void {
        this._store.dispatch(copyMergePortfolioActions.copyMergeSubmitted({
            data: this.selectedPortfolios(),
            portfolio: {
                description: this.description(),
                name: this.name(),
                createdAt: new Date()
            }
        }));
    }
}
