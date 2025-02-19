export enum PrinterType {
    DotMatrix = 'Dot Matrix',
    Inkjet = 'Inkjet',
    Laser = 'Laser'
}

export interface PrinterModel {
    accessories: string;
    brand: string;
    equipment: string;
    finishedDate: Date | string;
    handOverDate: Date | string;
    id?: string;
    model: string;
    name: string;
    number: number;
    phone: string;
    receivedDate: Date | string;
    reference: string;
    serviceResult: string;
    totalAmount: number;
    type: PrinterType;
    warrantyCap: number;
}
