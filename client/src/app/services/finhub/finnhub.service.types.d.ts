import { Observable } from "rxjs";
import { ServerHttpResponse } from "../../../lib/types/httpResponse";

export interface NewsItem {
   category: string;
   datetime: number; // UNIX timestamp
   headline: string;
   id: number;
   image: string;
   related: string;
   source: string;
   summary: string;
   url: string;
}
export interface HighChartModel {
   c: number;
   h: number;
   l: number;
   o: number;
   t: number;
   v: number;
   vw: number;
}

export interface FinnhubReturnTypes {
   getTopNews: ServerHttpResponse<NewsItem[]>;
   getDetails: ServerHttpResponse<{}>;
   getSearchResult: ServerHttpResponse<{
      count: number;
      result: {
         description: string;
         displaySymbol: string;
         symbol: string;
         type: string;
      }[];
   }>;
   getHighChartsData: ServerHttpResponse<HighChartModel[]>;
}
