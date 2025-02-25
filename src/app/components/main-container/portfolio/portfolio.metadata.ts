import { Validators } from '@angular/forms';

export const holdingDefaultValue = {
    ticker: null,
    shares: null,
    dateOfPurchase: new Date(),
    price: null
};

export const holdingDefaultFormValue = {
    ticker: [null, Validators.required],
    shares: [null, Validators.required],
    dateOfPurchase: new Date(),
    price: [null, Validators.required]
};