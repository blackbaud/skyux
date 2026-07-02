import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  viewChild,
} from '@angular/core';
import Chart from 'chart.js/auto';

const data = [
  { year: 2010, count: 10 },
  { year: 2011, count: 20 },
  { year: 2012, count: 15 },
  { year: 2013, count: 25 },
  { year: 2014, count: 22 },
  { year: 2015, count: 30 },
  { year: 2016, count: 28 },
];

/**
 * @preview
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  selector: 'sky-chart-bar',
  styles: ``,
  template: ` <canvas #chartRef></canvas>`,
})
export class SkyChartBar {
  protected readonly chartRef = viewChild.required('chartRef', {
    read: ElementRef,
  });

  constructor() {
    effect(() => {
      new Chart(this.chartRef().nativeElement, {
        type: 'bar',
        data: {
          // category axis:
          labels: [2010, 2011, 2012, 2013, 2014, 2015, 2016],
          // measure axes:
          datasets: [
            {
              label: 'Acquisitions by year',
              data: data.map((row) => row.count),
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Year',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Acquisitions',
              },
            },
          },
        },
      });
    });
  }
}
