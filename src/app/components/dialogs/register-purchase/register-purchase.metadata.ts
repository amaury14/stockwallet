import { Validators } from '@angular/forms';

export const holdingDefaultValue = {
    ticker: null,
    shares: null,
    dateOfPurchase: new Date(),
    price: null,
    notes: ''
};

export const holdingDefaultFormValue = {
    ticker: [null, Validators.required],
    shares: [null, Validators.required],
    dateOfPurchase: [new Date(), Validators.required],
    price: [null, Validators.required],
    notes: ''
};

export const holdingDefaultEditFormValue = {
    ticker: [{ value: null, disabled: true }, Validators.required],
    shares: [{ value: null, disabled: true }, Validators.required],
    dateOfPurchase: [{ value: null, disabled: true }, Validators.required],
    price: [{ value: null, disabled: true }, Validators.required],
    notes: [{ value: '', disabled: true }]
};