// historical-eps.component.ts

import { PolygonioService } from '@/services/polygino.service';
import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';

@Component({
  selector: 'app-historical-eps',
  templateUrl: './historical-eps.component.html',
  standalone: true,
  imports: [HighchartsChartModule],
  styleUrls: ['./historical-eps.component.scss']
})
export class HistoricalEpsComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  highchart = false
  @Input("ticker") ticker: any
  earnings:any
  constructor(private polygonioService: PolygonioService) { }


  earningsData() {
    this.polygonioService.getEarningChartData(this.ticker).subscribe((data) => {
      console.log(data)
      this.earnings = data;
      console.log(data);
      const actual: number[] = [];
      const estimate: number[] = [];
      const surprise: number[] = [];
      const period: string[] = [];
      this.earnings.forEach((d: any) => {
        actual.push(d['actual']);
        estimate.push(d['estimate']);
        surprise.push(d['surprise']);
        period.push(d['period']);
      });
      let xAxis = [];
      for (let i = 0; i < period.length; i++) {
        xAxis.push(period[i] + ' ' + 'surprise:' + surprise[i]);
      }
      this.chartOptions = {
        chart: {
          type: 'spline',
          backgroundColor: '#f7f7f7',
        },
        title: {
          text: 'Historical EPS Surprises',
          align: 'center',
          style: {
            fontSize: '15px',
          },
        },
        xAxis: {
          categories: xAxis,
        },
        yAxis: {
          title: {
            text: 'quaterly EPS',
          },
          labels: {
            format: '{value}°',
          },
        },
        tooltip: {
          shared: true,
        },
        plotOptions: {
          spline: {
            marker: {
              radius: 4,
              lineColor: '#666666',
              lineWidth: 1,
            },
          },
        },
        series: [
          {
            type: 'line',
            name: 'Actual',
            marker: {
              symbol: 'square',
            },
            data: actual,
          },
          {
            type: 'line',
            name: 'Estimate',
            marker: {
              symbol: 'diamond',
            },
            data: estimate,
          },
        ],
      };
      this.highchart=true
    });
  }

  ngOnInit(): void {
    this.earningsData()
  }
}
