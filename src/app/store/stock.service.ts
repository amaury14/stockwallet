import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { StockInformation, StockProfile } from './models';

@Injectable({
    providedIn: 'root',
})
export class StockService {

    constructor(private http: HttpClient) { }

    getStockData(ticker: string): Observable<StockInformation[]> {
        return this.http.get<{ body: StockInformation[] }>(
            `${environment.rapidApiURL}v1/markets/search?search=${ticker}`,
            {
                headers: {
                    [environment.xRapidApiHostField]: environment.xRapidApiHost,
                    [environment.xRapidApiKeyField]: environment.xRapidApiKey
                }
            }
        ).pipe(map(response => response.body));
    }

    getStockProfile(ticker: string): Observable<StockProfile> {
        return this.http.get<{ body: StockProfile; meta: StockProfile; }>(
            `${environment.rapidApiURL}v1/markets/stock/modules?ticker=${ticker}&module=asset-profile`,
            {
                headers: {
                    [environment.xRapidApiHostField]: environment.xRapidApiHost,
                    [environment.xRapidApiKeyField]: environment.xRapidApiKey
                }
            }
        ).pipe(map(response => ({ ...response.body, ...response.meta })));
    }

    getTickersData(page: number): Observable<StockInformation[]> {
        return this.http.get<{ body: StockInformation[] }>(
            `${environment.rapidApiURL}v2/markets/tickers?page=${page}&type=STOCKS`,
            {
                headers: {
                    [environment.xRapidApiHostField]: environment.xRapidApiHost,
                    [environment.xRapidApiKeyField]: environment.xRapidApiKey
                }
            }
        ).pipe(map(response => response.body));
    }
}
