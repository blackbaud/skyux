import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';
import Chart from 'chart.js/auto';

import { SkyChartJs, SkyChartJsConfig } from './chart-js';

@Component({
  imports: [SkyChartJs],
  template: `<sky-chart-js [config]="config()" />`,
})
class TestComponent {
  public readonly config = signal<SkyChartJsConfig<'bar'>>(buildConfig([1, 2]));
}

function buildConfig(data: number[]): SkyChartJsConfig<'bar'> {
  return {
    type: 'bar',
    data: {
      labels: ['a', 'b'],
      datasets: [{ label: 'Series', data }],
    },
    options: {},
  };
}

describe('Chart.js component', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let destroyed: boolean;

  function getCanvas(): HTMLCanvasElement {
    return fixture.nativeElement.querySelector('canvas');
  }

  function getChart(): Chart<'bar'> | undefined {
    return Chart.getChart(getCanvas()) as Chart<'bar'> | undefined;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestComponent] });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    destroyed = false;
  });

  afterEach(() => {
    if (!destroyed) {
      fixture.destroy();
    }
  });

  it('should create a chart from the configuration', () => {
    fixture.detectChanges();

    const chart = getChart();
    expect(chart).toBeTruthy();
    expect(chart?.data.datasets[0].data).toEqual([1, 2]);
  });

  it('should update the existing chart when the configuration changes', () => {
    fixture.detectChanges();

    const chart = getChart();
    component.config.set(buildConfig([3, 4]));
    fixture.detectChanges();

    expect(getChart()).toBe(chart);
    expect(chart?.data.datasets[0].data).toEqual([3, 4]);
  });

  it('should destroy the chart when destroyed', () => {
    fixture.detectChanges();

    const canvas = getCanvas();
    expect(Chart.getChart(canvas)).toBeTruthy();

    fixture.destroy();
    destroyed = true;

    expect(Chart.getChart(canvas)).toBeUndefined();
  });
});
