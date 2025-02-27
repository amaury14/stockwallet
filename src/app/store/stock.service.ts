import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, map, Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { StockInformation } from './models';

@Injectable({
    providedIn: 'root',
})
export class StockService {
    private apiUrl = '';

    constructor(private http: HttpClient) {
        this.apiUrl = environment.quoteApiUrl;
    }

    getStockData(ticker: string): Observable<StockInformation[]> {
        return this.http.get<{ bestMatches: StockInformation[] }>(`${this.apiUrl}&keywords=${ticker}`).pipe(
            map(response => response.bestMatches.map(item => {
                return Object.entries(item)?.reduce((acc, [key, value]) => {
                    const newKey = key.replace(/^\d+\.\s*/, "") as keyof StockInformation; // Remove number and dot
                    acc[newKey] = value;
                    return acc;
                }, {} as StockInformation)
            }
            ))
        );
    }
}
