import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { api_base } from '../../lib/config';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = api_base + '/transaction'; // Adjust the base URL as needed
  private stockApi =  api_base + '/stock';

  constructor(private http: HttpClient) { }

  buyStock(stockId: string, price: number, units: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/buy`, { stock_id: stockId, price, units });
  }

  sellStock(stockId: string, price: number, units: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sell`, { stock_id: stockId, price, units });
  }

  getWalletBalance(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/wallet-balance`);
  }

  getPortfolio(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/portfolio`);
  }

  getAllTransactionHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/transaction-history`);
  }

  getTotalStockQuantity(stockId: string): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/total-stock-quantity`, { stock_id: stockId });
  }

  getInsights(symbol: string): Observable<any> {
    return this.http.get<any>(`${this.stockApi}/insights/${symbol}`).pipe(
      map((response:any) => response.data)
    );
  }
}
