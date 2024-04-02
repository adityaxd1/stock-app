// stock-chart.component.ts

import { PolygonioService } from '@/services/polygino.service';
import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';

@Component({
  selector: 'app-stock-chart',
  templateUrl: './stock-chart.component.html',
  standalone:true,
  imports:[HighchartsChartModule],
  styleUrls: ['./stock-chart.component.scss']
})
export class StockChartComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  highchart=false
  @Input("ticker") ticker:any
  constructor(private polygonioService: PolygonioService) { }

  ngOnInit(): void {
    this.polygonioService.getLineChartData(this.ticker).subscribe((data: any) => {
      const stockData = this.parseChartData(data);
      console.log("stockData",)
      this.createChart(stockData);
    });
  }
  private parseChartData(data: any): any[] {
    // Parse the JSON data and map it to Highcharts format
    return data.results.map((result: any) => [result.t * 1000, result.c]); // Convert timestamp to milliseconds
  }

  private createChart(data: any[]): void {
    this.chartOptions = {
      title: {
        text: 'Last 6 Hours Historical Data'
      },
      xAxis: {
        type: 'datetime',
        labels: {
          formatter: () => {
            return Highcharts.dateFormat('%H:%M', (this as any).value);
          }
        }
      },
      yAxis: {
        title: {
          text: 'Stock Price'
        }
      },
      series: [{
        name: 'Stock Price',
        data: data,
        type: 'line'
      }]
    };
    this.highchart=true
  }
}
