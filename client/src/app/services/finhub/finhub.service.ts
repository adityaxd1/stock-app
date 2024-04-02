import { Injectable, OnInit } from "@angular/core";
import { FinnhubReturnTypes } from "./finnhub.service.types";
import { of } from "rxjs";
import { ServerHttpResponse } from "../../../lib/types/httpResponse";
import { HttpClient } from "@angular/common/http";
import { api_base } from "../../../lib/config";

@Injectable({
   providedIn: "root",
})
export class FinhubService {
   constructor(private http: HttpClient) {
      console.log("Service is Initialized");
   }

   getTopNews(symbol: string) {
      return this.http.get<FinnhubReturnTypes["getTopNews"]>(`${api_base}/api/news/top?symbol=${encodeURIComponent(symbol)}`);
   }

   getSearchResult(symbol: string) {
      return this.http.get<FinnhubReturnTypes["getSearchResult"]>(`${api_base}/stock/search?search=${symbol}`);
   }

   getHighChartsData(ticker: string) {
      return this.http.get<FinnhubReturnTypes["getHighChartsData"]>(`${api_base}/highcharts/${ticker}`);
   }


}
