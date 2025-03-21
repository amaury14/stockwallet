import { Validators } from '@angular/forms';
import { investmentTypes } from '../../../store/holdings/holdings.metadata';

export const holdingDefaultValue = {
    ticker: null,
    shares: null,
    dateOfPurchase: new Date(),
    price: null,
    investmentType: investmentTypes[0].name,
    notes: ''
};

export const holdingDefaultFormValue = {
    ticker: [null, Validators.required],
    shares: [null, Validators.required],
    dateOfPurchase: [new Date(), Validators.required],
    price: [null, Validators.required],
    investmentType: [investmentTypes[0].name, Validators.required],
    notes: ''
};

export const holdingDefaultEditFormValue = {
    ticker: [{ value: null, disabled: true }, Validators.required],
    shares: [{ value: null, disabled: true }, Validators.required],
    dateOfPurchase: [{ value: null, disabled: true }, Validators.required],
    price: [{ value: null, disabled: true }, Validators.required],
    investmentType: [{ value: investmentTypes[0].name, disabled: true }, Validators.required],
    notes: [{ value: '', disabled: true }]
};