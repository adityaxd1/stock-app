import { Component, OnDestroy, OnInit, Output, inject, signal } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { MatTab, MatTabGroup, MatTabsModule } from "@angular/material/tabs";
import { NewsCardComponent } from "@/components/news-card/news-card.component";
import { HighchartsChartModule } from "highcharts-angular";
import * as Highcharts from "highcharts";
import { BehaviorSubject, Observable, of, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { api_base } from "../../../../lib/config";
import { ServerHttpResponse } from "../../../../lib/types/httpResponse";
import { AlertService } from "@/services/alert.service";
import { CommonModule } from "@angular/common";
import HC_exporting from "highcharts/modules/exporting";
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { BuyPopupComponent } from "@/components/modals/buy-popup/buy-popup.component";
import { SellPopupComponent } from "@/components/modals/sell-popup/sell-popup.component";
import { CommonService } from "@/services/common.service";
import { TransactionService } from "@/services/transaction.service";
import { StockChartComponent } from "@/components/stock-chart/stock-chart.component";
import { ChartComponent } from "@/components/chart/chart.component";
import { HistoricalEpsComponent } from "@/components/historical-eps/historical-eps.component";
import { RecommendedTrendsComponent } from "@/components/recommended-trends/recommended-trends.component";
import { MatIconModule } from "@angular/material/icon";
// import { HighchartsDataService } from '@/services/highcharts-data.service';
HC_exporting(Highcharts);

@Component({
   selector: "app-stock-details-page",
   standalone: true,
   imports: [CommonModule, MatTabsModule,MatDialogModule, NewsCardComponent, HighchartsChartModule, RouterLink, StockChartComponent,ChartComponent,HistoricalEpsComponent,RecommendedTrendsComponent,MatIconModule],
   templateUrl: "./stock-details-page.component.html",
   styleUrl: "./stock-details-page.component.scss",
})
export class StockDetailsPage implements OnInit,OnDestroy {
   [x: string]: any;
   Highcharts: typeof Highcharts = Highcharts;
   chartConstructor: string = "chart";
   chartOptions: Highcharts.Options = {};
   alertService = inject(AlertService);
   stockNews = signal<any[]>([]);
   updateFlag: boolean = false;
   ticker:any=""
   stockDetailsResult = signal<any>({});
   interval:any
   portfolioQuantity:any
   localLoader=false
   insightsTable:any={}
   constructor(public route: ActivatedRoute,
      public dialog: MatDialog,
      public http: HttpClient,public commonService:CommonService,public transactionService:TransactionService) {
      this.route.paramMap.subscribe((v) => console.log(v));
   }

   ngOnInit(): void {
      
      this.route.paramMap.subscribe((params) => {
         const symbol = params.get("symbol");
         console.log(symbol,this.commonService.selectedTicker)
         this.localLoader=true
         if(this.commonService.selectedTicker!=symbol){
            this.commonService.showLoader()
         }
         this.ticker=symbol
         this.commonService.selectedTicker=this.ticker
         this.getAvailableQuantity()
         if (symbol) {
            this.http.get<ServerHttpResponse<any>>(`${api_base}/stock/details/${symbol}`).subscribe({
               next: (result) => {
                  this.stockDetailsResult.set(result.data);
                 console.log("Stock Details:", result.data);
                  this.commonService.hideLoader()
                  this.localLoader=false
               },
               error: (err) => {
                  console.error("Error fetching stock details:", err);
                  this.commonService.hideLoader()
                  this.localLoader=false
               },
            });
            this.fetchStockNews(symbol);
            this.fetchInsights(symbol)
            // this.fetchHighchartsData(symbol);
         }
      });
      this.interval=setInterval(()=>{
         if(this.isMarketOpen(this.stockDetailsResult()?.quote?.t*1000)){
            this.refreshDataWithoutLoader()
         }
      },15000)
   }

   refreshDataWithoutLoader(){
      this.route.paramMap.subscribe((params) => {
         const symbol = params.get("symbol");
         if (symbol) {
            this.http.get<ServerHttpResponse<any>>(`${api_base}/stock/details/${symbol}`).subscribe({
               next: (result) => {
                  this.stockDetailsResult.set(result.data);
                  if(!this.stockDetailsResult().profile?.ticker){
                     this.alertService.add({type:'error', message: `No data found. Please enter a valid Ticker.` });
                  }
                  console.log("Stock Details:", result.data);
               },
               error: (err) => {
                  console.error("Error fetching stock details:", err);
               },
            });
            console.log("here>>>>>>>>>>>>>")
            
            // this.fetchHighchartsData(symbol);
         }
      });
   }

   timestapToString(timestamp: any) {
      return new Date(timestamp).toLocaleString();
   }

   onAddWishList(symbol: string) {
      console.log(symbol);
      this.http.post<ServerHttpResponse<any>>(`${api_base}/wishlist/add`, { symbol }).subscribe({
         next: (value) => {
            if (value.data?.acknowledged) {
               this.alertService.add({ message: `${symbol} added to Watchlist.` });
               this.stockDetailsResult.update((prev) => ({ ...prev, is_in_wishlist: true }));
            }
         },
         error: (e) => {
            console.log(e);
         },
      });
   }
   onRemoveWishlist(symbol: string) {
      console.log(symbol);
      this.http.delete<ServerHttpResponse<any>>(`${api_base}/wishlist/remove/${symbol}`).subscribe({
         next: (value) => {
            console.log(value);
            if (value.data?.deletedCount) {
               this.alertService.add({ message: `Removed ${symbol} from Watchlist` });
               this.stockDetailsResult.update((prev) => ({ ...prev, is_in_wishlist: false }));
            }
         },
         error: (e) => {
            console.log(e);
         },
      });
   }

   stockNews$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

   private fetchStockNews(symbol: string): void {
      this.http.get<ServerHttpResponse<any>>(`${api_base}/stock/latest-news/${symbol}`).subscribe({
         next: (response) => {
            if (response.success) {
               // Make sure to pass the 'news' array, not the entire response object
               this.stockNews$.next(response.data.news);
            } else {
               console.error("Failed to load news:", response.msg);
            }
         },
         error: (err) => {
            console.error("Error fetching news:", err);
         },
      });
   }

   
   private fetchInsights(symbol: string): void {
      console.log("insigths fetch")
      this.transactionService.getInsights(symbol).subscribe({
         next: (response:any) => {
            console.log(response)
            if (response.data) {
               this.insightsTable={totalmspr:0,positivemspr:0,negativemspr:0,totalchange:0,positivechange:0,negativechange:0}
               response.data.forEach((element:any) => {
                 if(element.mspr>0){
                  this.insightsTable['positivemspr']+=element.mspr
                 }else{
                  this.insightsTable['negativemspr']+=element.mspr
                 }
                 this.insightsTable['totalmspr']+=element.mspr
                 if(element.change>0){
                  this.insightsTable['positivechange']+=element.change
                 }else{
                  this.insightsTable['negativechange']+=element.change
                 }
                 this.insightsTable['totalchange']+=element.change
               });
               console.log(this.insightsTable)
            } else {
               console.error("Failed to load news:", response.msg);
            }
         },
         error: (err) => {
            console.error("Error fetching news:", err);
         },
      });
   }

   getAvailableQuantity(){
      this.transactionService.getTotalStockQuantity(this.ticker).subscribe((res: any) => {
         this.portfolioQuantity = res.data.total_quantity
       })
   }

   isMarketOpen(lastTimestamp: number): boolean {
      const fiveMinutes = 5 * 60 * 1000;
      const now = new Date().getTime();
      return now - (lastTimestamp * 1000 * 1000) < fiveMinutes;
   }
   buy(){
      const dialogRef = this.dialog.open(BuyPopupComponent, {
        data: this.stockDetailsResult(),
        panelClass: 'custom-dialog-class'
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
        if (result) {
         setTimeout(() => {
            this.getAvailableQuantity()
         }, 2000);
        }
      });
    }
    sell(){
      const dialogRef = this.dialog.open(SellPopupComponent, {
        data: this.stockDetailsResult(),
        panelClass: 'custom-dialog-class'
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
        if (result) {
         setTimeout(() => {
            this.getAvailableQuantity()
         }, 2000);
        }
      });
    }
   // private fetchHighchartsData(symbol: string): void {
   //    this.highchartsDataService.getHighChartsData(symbol).subscribe(
   //       (response: any) => {
   //          this.createHighChart(response);
   //       },
   //       (error) => {
   //          console.error("Error fetching Highcharts data:", error);
   //          this.alertService.error("Error fetching Highcharts data.");
   //       }
   //    );
   // }

   // private createHighChart(highChartsData: any): void {
   //    const ohlcData = highChartsData.map((res: any) => ({
   //       x: res.t * 1000, // Convert UNIX timestamp to JavaScript timestamp
   //       open: res.o,
   //       high: res.h,
   //       low: res.l,
   //       close: res.c,
   //    }));

   //    const volumeData = highChartsData.map((res: any) => ({
   //       x: res.t * 1000,
   //       y: res.v,
   //    }));

   //    this.chartOptions = {
   //       // ... existing chartOptions
   //       series: [
   //          {
   //             type: "candlestick",
   //             name: `${symbol} Stock Price`,
   //             data: ohlcData,
   //          },
   //          {
   //             type: "column",
   //             name: "Volume",
   //             data: volumeData,
   //             yAxis: 1,
   //          },
   //       ],
   //       // Add other options as necessary
   //    };

   //    // Set flag to true to update the chart
   //    this.updateFlag = true;
   // }

   // ... include other methods and logic for your component

   ngOnDestroy(): void {
      clearInterval(this.interval)
   }
}
