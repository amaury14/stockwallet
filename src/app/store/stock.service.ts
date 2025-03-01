import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { StockInformation } from './models';

@Injectable({
    providedIn: 'root',
})
export class StockService {

    constructor(private http: HttpClient) { }

    getStockData(ticker: string): Observable<StockInformation[]> {
        return this.http.get<{ body: StockInformation[] }>(
            `${environment.rapidApiURL}markets/search?search=${ticker}`,
            {
                headers: {
                    [environment.xRapidApiHostField]: environment.xRapidApiHost,
                    [environment.xRapidApiKeyField]: environment.xRapidApiKey
                }
            }
        ).pipe(map(response => response.body));
    }
}
