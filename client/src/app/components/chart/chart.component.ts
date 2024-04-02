// chart.component.ts

import { PolygonioService } from '@/services/polygino.service';
import { Component, Input, OnInit } from '@angular/core';

import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import HC_stock from 'highcharts/modules/stock';
HC_stock(Highcharts);

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  standalone: true,
  imports: [HighchartsChartModule],
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  highchart = false
  Highchart:any
  @Input("ticker") ticker: any
  updateFlag:any
  constructor(private polygonioService: PolygonioService) { }


  HighchartData() {
    this.polygonioService.getStockChartData(this.ticker).subscribe((data) => {
      console.log(data)
      this.Highchart = data.results;
      console.log(data);
      let candlestickValues: number[][] = [];
      let volumeValues: number[][] = [];
      this.Highchart.forEach((d: any) => {
        candlestickValues.push([d['t'], d['o'], d['h'], d['l'], d['c']]);
        volumeValues.push([d['t'], d['v']]);
      });
      let sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      this.chartOptions = {
        rangeSelector: {
          enabled: true,
          inputEnabled: false,
          allButtonsEnabled: true,
          buttons: [
            {
              type: 'month',
              count: 1,
              text: '1m',
            },
            {
              type: 'month',
              count: 3,
              text: '3m',
            },
            {
              type: 'month',
              count: 6,
              text: '6m',
            },
            {
              type: 'ytd',
              text: 'YTD',
            },
            {
              type: 'year',
              count: 1,
              text: '1y',
            },
            {
              type: 'all',
              text: 'All',
            },
          ],
          selected: 2,
        },
        navigator: {
          enabled: true,
        },
        scrollbar: {
          enabled: true,
        },
        title: {
          text: ' Historical',
        },
        subtitle: {
          text: 'With SMA and Volume by Price technical indicators',
        },

        xAxis: {
          type: 'datetime',
          ordinal: true,
          min: sixMonthsAgo.getTime(),
          max: new Date().getTime(),
        },
        yAxis: [
          {
            labels: {
              align: 'right',
              x: -3,
            },
            title: {
              text: 'OHLC',
            },
            height: '60%',
            lineWidth: 2,
            lineColor: 'black',
            offset: 2,
            resize: {
              enabled: true,
            },
            opposite: true,
          },
          {
            labels: {
              align: 'right',
              x: -3,
              y: -10,
            },
            title: {
              text: 'Volume',
            },

            top: '65%',
            height: '35%',
            offset: 2,
            lineWidth: 2,
            lineColor: 'black',
            opposite: true,
          },
        ],

        series: [
          {
            type: 'candlestick',
            name: 'AAPL',
            id: 'aapl',
            yAxis: 0,
            data: candlestickValues,
          },
          {
            type: 'column',
            id: 'volume',
            color: '#6e4fd9', // Blue color
            borderRadius: 5,
            yAxis: 1,
            data: volumeValues,
          },
          {
            type: 'vbp',
            linkedTo: 'aapl',
            params: {
              volumeSeriesID: 'volume',
            },
            dataLabels: {
              enabled: false,
            },
            zoneLines: {
              enabled: false,
            },
          },
          {
            type: 'sma',
            linkedTo: 'aapl',
            zIndex: 1,
            marker: {
              enabled: false,
            },
            params: {
              period: 14,
              index: 3,
            },
          },
        ],
      };
      this.updateFlag = true;
      this.highchart=true
    });
  }


ngOnInit(): void {
  this.polygonioService.getStockChartData(this.ticker).subscribe((data: any) => {
    const stockData = this.parseChartData(data);
    this.createChart(stockData);
  });
  // this.HighchartData()
}

  private parseChartData(data: any): any[] {
  // Parse the JSON data and map it to Highcharts format
  return data.results.map((result: any) => [new Date(result.t).getTime(), result.c, result.v]);
}

  private createChart(data: any[]): void {
  console.log(data, "Chartdata2222")
    this.chartOptions = {
    title: {
      text: 'Stock Price (AAPL) - ' + new Date().toISOString().split('T')[0]
    },
    subtitle: {
      text: 'Source: Polygon.io',
      style: {
        color: 'blue'
      }
    },
    xAxis: {
      type: 'datetime'
    },
    yAxis: [{
      title: {
        text: 'Stock Price'
      },
      labels: {
        format: '{value}'
      }
    }, {
      title: {
        text: 'Volume'
      },
      opposite: true,
      labels: {
        format: '{value}'
      }
    }],
    series: [{
      name: 'Stock Price',
      data: data.map(item => [item[0], item[1]]), // Date, Close Price
      type: 'line',
      tooltip: {
        valueDecimals: 2
      }
    }, {
      name: 'Volume',
      data: data.map(item => [item[0], item[2]]), // Date, Volume
      type: 'column',
      yAxis: 1,
      tooltip: {
        valueDecimals: 0
      }
    }]
  };
  this.highchart = true
    console.log(this.chartOptions, "chartoptions");
}
}
