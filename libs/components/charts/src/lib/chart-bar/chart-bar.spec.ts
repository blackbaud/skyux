import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';
import { SkyLogService } from '@skyux/core';
import { SkyThemeService, type SkyThemeSettingsChange } from '@skyux/theme';
import Chart, { type TooltipItem } from 'chart.js/auto';
import { ReplaySubject } from 'rxjs';

import { SkyChartAxisCategory } from '../chart-axes/chart-axis-category';
import { SkyChartAxisValue } from '../chart-axes/chart-axis-value';
import { SkyChartSeries } from '../chart-series/chart-series';
import { SkyChartTableService } from '../chart-table/chart-table-service';
import { SkyChartValueFormat } from '../shared/value-format';

import { SkyChartBar } from './chart-bar';
import { SkyChartBarOrientation } from './chart-bar-orientation';
import { SkyChartBarSeriesLayout } from './chart-bar-series-layout';

type ScaleProbe = {
  type: string;
  position: string;
  stacked?: boolean;
  grid: { drawOnChartArea: boolean };
  ticks: { callback: (value: number | string) => string };
};

@Component({
  imports: [
    SkyChartBar,
    SkyChartAxisCategory,
    SkyChartAxisValue,
    SkyChartSeries,
  ],
  template: `
    @if (renderChart) {
      <sky-chart-bar
        [orientation]="orientation"
        [seriesLayout]="seriesLayout"
        [height]="chartHeight"
      >
        @if (renderCategoryAxis) {
          <sky-chart-axis-category labelText="Year" [categories]="categories" />
        }
        @for (axisId of valueAxisIds; track $index) {
          <sky-chart-axis-value
            labelText="Value"
            [axisId]="axisId"
            [currencyCode]="currencyCode"
            [format]="format"
            [scaleType]="valueScaleType"
          />
        }
        @if (renderSeries) {
          <sky-chart-series
            [labelText]="seriesLabel"
            [valueAxisId]="seriesValueAxis"
            [values]="values"
          />
        }
      </sky-chart-bar>
    }
  `,
})
class TestComponent {
  @ViewChild(SkyChartBar)
  public chartBar!: SkyChartBar;

  public categories: (string | number)[] = ['2023', '2024'];
  public chartHeight: string | undefined;
  public currencyCode: string | undefined;
  public format: SkyChartValueFormat | undefined;
  public orientation: SkyChartBarOrientation = 'vertical';
  public renderCategoryAxis = true;
  public renderChart = true;
  public renderSeries = true;
  public seriesLabel = 'Acquisitions';
  public seriesValueAxis: string | undefined;
  public seriesLayout: SkyChartBarSeriesLayout = 'grouped';
  public valueAxisIds: (string | undefined)[] = [undefined];
  public valueScaleType: 'linear' | 'logarithmic' = 'linear';
  public values = [10, 20];
}

describe('Chart bar component', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let logSvc: jasmine.SpyObj<SkyLogService>;
  let tableSvc: SkyChartTableService;
  let destroyed: boolean;

  function getCanvas(): HTMLCanvasElement {
    return fixture.nativeElement.querySelector('canvas');
  }

  function getChart(): Chart<'bar'> | undefined {
    return Chart.getChart(getCanvas()) as Chart<'bar'> | undefined;
  }

  function requireChart(): Chart<'bar'> {
    const chart = getChart();

    if (!chart) {
      throw new Error('Expected a chart to have been created.');
    }

    return chart;
  }

  function getScale(chart: Chart<'bar'>, key: string): ScaleProbe {
    return chart.options.scales?.[key] as unknown as ScaleProbe;
  }
  function getTooltipLabel(
    chart: Chart<'bar'>,
  ): (context: TooltipItem<'bar'>) => string {
    return chart.options.plugins?.tooltip?.callbacks?.label as (
      context: TooltipItem<'bar'>,
    ) => string;
  }

  function tooltipContext(
    datasetIndex: number,
    label: string,
    value: number | null,
    direction: 'x' | 'y' = 'y',
  ): TooltipItem<'bar'> {
    return {
      datasetIndex,
      dataset: { label },
      parsed: {
        x: direction === 'x' ? value : 0,
        y: direction === 'y' ? value : 0,
      },
    } as unknown as TooltipItem<'bar'>;
  }

  beforeEach(() => {
    logSvc = jasmine.createSpyObj<SkyLogService>('SkyLogService', ['warn']);

    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [
        SkyChartTableService,
        { provide: SkyLogService, useValue: logSvc },
      ],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    tableSvc = TestBed.inject(SkyChartTableService);
    destroyed = false;
  });

  afterEach(() => {
    if (!destroyed) {
      fixture.destroy();
    }
  });

  it('should build the data table from the axes and series', () => {
    fixture.detectChanges();

    expect(tableSvc.table()).toEqual({
      categoryLabel: 'Year',
      categories: ['2023', '2024'],
      series: [{ label: 'Acquisitions', values: ['10', '20'] }],
    });
  });

  it('should publish an accessible summary from the axes and series', () => {
    component.valueAxisIds = [undefined, 'value-1'];
    fixture.detectChanges();

    expect(tableSvc.summary()).toEqual({
      resourceKey: 'skyux_charts.chart.bar.accessible_summary',
      args: [1, 2],
    });
  });

  it('should clear the accessible summary when the plot is destroyed', () => {
    fixture.detectChanges();

    expect(tableSvc.summary()).not.toBeUndefined();

    fixture.destroy();
    destroyed = true;

    expect(tableSvc.summary()).toBeUndefined();
  });

  it('should format the data table values using the value axis format', () => {
    component.format = 'currency';
    component.currencyCode = 'USD';
    fixture.detectChanges();

    expect(tableSvc.table()?.series[0].values).toEqual(['$10.00', '$20.00']);
  });

  it('should not build a table or chart without a category axis', () => {
    component.renderCategoryAxis = false;
    fixture.detectChanges();

    expect(tableSvc.table()).toBeUndefined();
    expect(tableSvc.summary()).toBeUndefined();
    expect(getChart()).toBeUndefined();

    // Covers the destroy path when no chart was created.
    fixture.destroy();
    destroyed = true;
  });

  it('should not build a table or chart without a series', () => {
    component.renderSeries = false;
    fixture.detectChanges();

    expect(tableSvc.table()).toBeUndefined();
    expect(getChart()).toBeUndefined();
  });

  it('should not build a table or chart without a value axis', () => {
    component.valueAxisIds = [];
    fixture.detectChanges();

    expect(tableSvc.table()).toBeUndefined();
    expect(getChart()).toBeUndefined();
  });

  it('should create a vertical bar chart from the axes and series', () => {
    fixture.detectChanges();

    const chart = requireChart();
    expect(chart.data.labels).toEqual(['2023', '2024']);
    expect(chart.data.datasets[0].label).toBe('Acquisitions');
    expect(chart.data.datasets[0].data).toEqual([10, 20]);
    expect(chart.options.indexAxis).toBe('x');
    expect(chart.data.datasets[0].yAxisID).toBe('value-0');
    expect(chart.data.datasets[0].xAxisID).toBe('category');

    const category = getScale(chart, 'category');
    const value = getScale(chart, 'value-0');
    expect(category.position).toBe('bottom');
    expect(category.grid.drawOnChartArea).toBe(false);
    expect(value.position).toBe('left');
    expect(value.grid.drawOnChartArea).toBe(true);
  });

  it('should not stack the scales by default', () => {
    fixture.detectChanges();

    const chart = requireChart();
    expect(getScale(chart, 'category').stacked).toBe(false);
    expect(getScale(chart, 'value-0').stacked).toBe(false);
  });

  it('should stack the category and value scales when seriesLayout is stacked', () => {
    component.seriesLayout = 'stacked';
    fixture.detectChanges();

    const chart = requireChart();
    expect(getScale(chart, 'category').stacked).toBe(true);
    expect(getScale(chart, 'value-0').stacked).toBe(true);
  });

  it('should assign the series a categorical data-visualization color', () => {
    fixture.detectChanges();

    const dataset = requireChart().data.datasets[0];
    expect(typeof dataset.backgroundColor).toBe('string');
  });

  it('should use internal sizing when no height is set', () => {
    fixture.detectChanges();

    const chartEl = fixture.nativeElement.querySelector(
      'sky-chart-js',
    ) as HTMLElement;
    expect(chartEl.style.height).toBe('');
  });

  it('should apply an explicit CSS height when set', () => {
    component.chartHeight = '400px';
    fixture.detectChanges();

    const chartEl = fixture.nativeElement.querySelector(
      'sky-chart-js',
    ) as HTMLElement;
    expect(chartEl.style.height).toBe('400px');
  });

  it('should format axis ticks using the value axis format', () => {
    fixture.detectChanges();

    const value = getScale(requireChart(), 'value-0');
    expect(value.ticks.callback(1234)).toBe('1,234');
  });

  it('should apply the same themed styling to the category and value axes', () => {
    fixture.detectChanges();

    const chart = requireChart();
    type StyleProbe = {
      grid: { color: string; tickLength: number };
      border: { color: string };
      ticks: { color: string; font: { size: number; family: string } };
    };
    const category = chart.options.scales?.[
      'category'
    ] as unknown as StyleProbe;
    const value = chart.options.scales?.['value-0'] as unknown as StyleProbe;

    // Tokens are resolved to concrete values, never the raw property name.
    expect(category.grid.color).not.toContain('--sky');
    expect(typeof category.grid.tickLength).toBe('number');
    expect(typeof category.ticks.font.size).toBe('number');

    // The value axis shares the category axis's resolved themed styling.
    expect(value.grid.color).toBe(category.grid.color);
    expect(value.border.color).toBe(category.border.color);
    expect(value.ticks.color).toBe(category.ticks.color);
    expect(value.ticks.font.size).toBe(category.ticks.font.size);
    expect(value.ticks.font.family).toBe(category.ticks.font.family);
  });

  it('should format the tooltip label with the series label', () => {
    fixture.detectChanges();

    const label = getTooltipLabel(requireChart());
    expect(label(tooltipContext(0, 'Acquisitions', 20))).toBe(
      'Acquisitions: 20',
    );
  });

  it('should format the tooltip without a label and treat a null value as zero', () => {
    component.seriesLabel = '';
    fixture.detectChanges();

    const label = getTooltipLabel(requireChart());
    expect(label(tooltipContext(0, '', null))).toBe('0');
  });

  it('should create a horizontal bar chart', () => {
    component.orientation = 'horizontal';
    fixture.detectChanges();

    const chart = requireChart();
    expect(chart.options.indexAxis).toBe('y');
    expect(chart.data.datasets[0].xAxisID).toBe('value-0');
    expect(chart.data.datasets[0].yAxisID).toBe('category');
    expect(getScale(chart, 'category').position).toBe('left');
    expect(getScale(chart, 'value-0').position).toBe('bottom');
  });

  it('should default the value axis to a linear scale', () => {
    fixture.detectChanges();

    expect(getScale(requireChart(), 'value-0').type).toBe('linear');
  });

  it('should use a logarithmic scale when specified', () => {
    component.valueScaleType = 'logarithmic';
    fixture.detectChanges();

    expect(getScale(requireChart(), 'value-0').type).toBe('logarithmic');
  });

  it('should position a secondary value axis and bind a series to it', () => {
    component.valueAxisIds = ['primary', 'secondary'];
    component.seriesValueAxis = 'secondary';
    fixture.detectChanges();

    const chart = requireChart();
    expect(chart.data.datasets[0].yAxisID).toBe('secondary');
    expect(getScale(chart, 'primary').position).toBe('left');
    expect(getScale(chart, 'secondary').position).toBe('right');
    expect(getScale(chart, 'secondary').grid.drawOnChartArea).toBe(false);
  });

  it('should position a secondary value axis in a horizontal chart', () => {
    component.orientation = 'horizontal';
    component.valueAxisIds = ['primary', 'secondary'];
    component.seriesValueAxis = 'secondary';
    fixture.detectChanges();

    const chart = requireChart();
    expect(getScale(chart, 'primary').position).toBe('bottom');
    expect(getScale(chart, 'secondary').position).toBe('top');
  });

  it('should warn and fall back to the first value axis for an unknown value axis', () => {
    component.valueAxisIds = ['primary'];
    component.seriesValueAxis = 'nope';
    fixture.detectChanges();

    expect(logSvc.warn).toHaveBeenCalled();
    expect(requireChart().data.datasets[0].yAxisID).toBe('primary');
  });

  it('should update an existing chart when inputs change', () => {
    fixture.detectChanges();

    const chart = requireChart();
    component.values = [30, 40];
    fixture.detectChanges();

    expect(getChart()).toBe(chart);
    expect(chart.data.datasets[0].data).toEqual([30, 40]);
  });

  it('should destroy the chart and clear the table when destroyed', () => {
    fixture.detectChanges();

    const canvas = getCanvas();
    expect(Chart.getChart(canvas)).toBeTruthy();

    fixture.destroy();

    expect(Chart.getChart(canvas)).toBeUndefined();
    expect(tableSvc.table()).toBeUndefined();
    destroyed = true;
  });
});

describe('Chart bar component without a table service', () => {
  @Component({
    imports: [
      SkyChartBar,
      SkyChartAxisCategory,
      SkyChartAxisValue,
      SkyChartSeries,
    ],
    template: `
      <sky-chart-bar>
        <sky-chart-axis-category labelText="Year" [categories]="categories" />
        <sky-chart-axis-value labelText="Value" />
        <sky-chart-series labelText="Series" [values]="values" />
      </sky-chart-bar>
    `,
  })
  class StandaloneComponent {
    public categories = ['2023', '2024'];
    public values = [10, 20];
  }

  it('should render the chart when no table service is provided', () => {
    TestBed.configureTestingModule({ imports: [StandaloneComponent] });

    const fixture = TestBed.createComponent(StandaloneComponent);
    fixture.detectChanges();

    const canvas = fixture.nativeElement.querySelector('canvas');
    expect(Chart.getChart(canvas)).toBeTruthy();

    fixture.destroy();
  });
});

describe('Chart bar component with a theme service', () => {
  it('should rebuild the chart when the theme settings change', () => {
    const settingsChange = new ReplaySubject<SkyThemeSettingsChange>(1);
    settingsChange.next({ currentSettings: {} } as SkyThemeSettingsChange);

    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [
        SkyChartTableService,
        {
          provide: SkyLogService,
          useValue: jasmine.createSpyObj<SkyLogService>('SkyLogService', [
            'warn',
          ]),
        },
        { provide: SkyThemeService, useValue: { settingsChange } },
      ],
    });

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const canvas = fixture.nativeElement.querySelector('canvas');
    const chart = Chart.getChart(canvas);
    expect(chart).toBeTruthy();

    // A new theme rebuilds the config, updating the existing chart in place
    // rather than recreating it.
    settingsChange.next({ currentSettings: {} } as SkyThemeSettingsChange);
    fixture.detectChanges();

    expect(Chart.getChart(canvas)).toBe(chart);

    fixture.destroy();
  });
});
