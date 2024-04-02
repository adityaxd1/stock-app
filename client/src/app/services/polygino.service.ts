import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { api_base } from '../../lib/config';

@Injectable({
  providedIn: 'root'
})
export class PolygonioService {

  private baseUrl = api_base + '/stock'; // Assuming your backend API base URL is '/api'

  constructor(private http: HttpClient) { }

  getStockChartData(stockTicker: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/stock-chart/${stockTicker}`).pipe(
      map(response => response.data)
    );
  }

  getRecommendedChartData(stockTicker: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/recommended-chart/${stockTicker}`).pipe(
      map((response:any) => response.data)
    );
  }

  getEarningChartData(stockTicker: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/earning-chart/${stockTicker}`).pipe(
      map((response:any) => response.data)
    );
  }

  getLineChartData(stockTicker: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/line-chart/${stockTicker}`).pipe(
      map((response:any) => response.data)
    );
  }
}
