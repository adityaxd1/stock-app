// recommended-trends.component.ts

import { PolygonioService } from '@/services/polygino.service';
import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';

@Component({
  selector: 'app-recommended-trends',
  templateUrl: './recommended-trends.component.html',
  standalone: true,
  imports: [HighchartsChartModule],
  styleUrls: ['./recommended-trends.component.scss']
})
export class RecommendedTrendsComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  highchart = false
  @Input("ticker") ticker: any
  rTrends:any
  constructor(private polygonioService: PolygonioService) { }

  rTrendsData() {
    this.polygonioService.getStockChartData(this.ticker).subscribe((data) => {
      this.rTrends = data.results;
      console.log(data);
      const strongBuy: number[] = [];
      const buy: number[] = [];
      const hold: number[] = [];
      const sell: number[] = [];
      const strongSell: number[] = [];
      const categories: string[] = [];
      this.rTrends.forEach((d: any) => {
        strongBuy.push(d['strongBuy']);
        buy.push(d['buy']);
        hold.push(d['hold']);
        sell.push(d['sell']);
        strongSell.push(d['strongSell']);
        categories.push(d['period']);
      });
      this.chartOptions = {
        chart: {
          type: 'column',
          backgroundColor: '#f7f7f7',
        },

        title: {
          text: 'Recommendation Trends',
          align: 'center',
          style: {
            fontSize: '15px',
          },
        },

        xAxis: {
          categories: categories,
        },

        yAxis: {
          allowDecimals: false,
          min: 0,
          title: {
            text: '#Analysis',
          },
        },

        plotOptions: {
          column: {
            stacking: 'normal',
            dataLabels: {
              enabled: true,
              color: '#FFFFFF',
              style: {
                textOutline: '0px',
              },
              formatter: function () {
                return this.y;
              },
            },
          },
        },

        series: [
          {
            type: 'column',
            name: 'Strong Buy',
            color: 'darkgreen',
            data: strongBuy,
          },
          {
            type: 'column',
            name: 'Buy',
            color: 'green',
            data: buy,
          },
          {
            type: 'column',
            name: 'Hold',
            color: 'yellow',
            data: hold,
          },
          {
            type: 'column',
            name: 'Sell',
            color: 'orange',
            data: sell,
          },
          {
            type: 'column',
            name: 'Strong Sell',
            color: 'red',
            data: strongSell,
          },
        ],
      };
      this.highchart=true
    });
  }

  ngOnInit(): void {
    this.rTrendsData()
  }


}
