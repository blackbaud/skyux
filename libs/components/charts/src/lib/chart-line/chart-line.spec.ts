import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyLogService } from '@skyux/core';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  type SkyThemeSettingsChange,
} from '@skyux/theme';
import { Chart, type TooltipItem } from 'chart.js';
import { ReplaySubject } from 'rxjs';

import { SkyChartAxisCategory } from '../chart-axis/chart-axis-category';
import { SkyChartAxisValue } from '../chart-axis/chart-axis-value';
import { SkyChartTableService } from '../chart-table/chart-table-service';
import { SkyChart } from '../chart/chart';
import { SkyChartValueFormat } from '../shared/value-format';

import { SkyChartLine } from './chart-line';
import { SkyChartLineSeries } from './chart-line-series';
import { type SkyChartLineSeriesValue } from './chart-line-series-value';

type ScaleProbe = {
  type: string;
  position: string;
  grid: { drawOnChartArea: boolean };
  ticks: { callback: (value: number | string) => string };
};

@Component({
  imports: [
    SkyChart,
    SkyChartLine,
    SkyChartAxisCategory,
    SkyChartAxisValue,
    SkyChartLineSeries,
  ],
  template: `
    <sky-chart headingText="Test chart">
      <sky-chart-line>
        @if (renderCategoryAxis) {
          <sky-chart-axis-category labelText="Year" [categories]="categories" />
        }
        @if (renderValueAxis) {
          <sky-chart-axis-value
            labelText="Value"
            [currencyCode]="currencyCode"
            [format]="format"
            [scaleType]="valueScaleType"
          />
        }
        @if (renderSeries) {
          <sky-chart-line-series [labelText]="seriesLabel" [values]="values" />
        }
        @if (renderSecondSeries) {
          <sky-chart-line-series labelText="Target" [values]="values" />
        }
      </sky-chart-line>
    </sky-chart>
  `,
})
class TestComponent {
  @ViewChild(SkyChartLine)
  public chartLine!: SkyChartLine;

  public categories: (string | number)[] = ['2023', '2024'];
  public currencyCode: string | undefined;
  public format: SkyChartValueFormat | undefined;
  public renderCategoryAxis = true;
  public renderSeries = true;
  public renderSecondSeries = false;
  public renderValueAxis = true;
  public seriesLabel = 'Acquisitions';
  public valueScaleType: 'linear' | 'logarithmic' = 'linear';
  public values: SkyChartLineSeriesValue[] = [10, 20];
}

describe('Chart line component', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let destroyed: boolean;

  // The plot publishes its table to the `SkyChartTableService` provided by
  // the surrounding `sky-chart`, so the service is read from that injector.
  function tableSvc(): SkyChartTableService {
    return fixture.debugElement
      .query(By.directive(SkyChart))
      .injector.get(SkyChartTableService);
  }

  function getCanvas(): HTMLCanvasElement {
    return fixture.nativeElement.querySelector('canvas');
  }

  function getChartContainerHeight(): string {
    const container = fixture.nativeElement.querySelector(
      'sky-chart-js',
    ) as HTMLElement;

    return container.style.height;
  }

  function getChart(): Chart<'line'> | undefined {
    return Chart.getChart(getCanvas()) as Chart<'line'> | undefined;
  }

  function requireChart(): Chart<'line'> {
    const chart = getChart();

    if (!chart) {
      throw new Error('Expected a chart to have been created.');
    }

    return chart;
  }

  function getScale(chart: Chart<'line'>, key: string): ScaleProbe {
    return chart.options.scales?.[key] as unknown as ScaleProbe;
  }

  function getTooltipLabel(
    chart: Chart<'line'>,
  ): (context: TooltipItem<'line'>) => string {
    return chart.options.plugins?.tooltip?.callbacks?.label as (
      context: TooltipItem<'line'>,
    ) => string;
  }

  function tooltipContext(
    datasetIndex: number,
    label: string,
    value: number | null,
  ): TooltipItem<'line'> {
    return {
      datasetIndex,
      dataset: { label },
      parsed: { x: 0, y: value },
    } as unknown as TooltipItem<'line'>;
  }

  beforeEach(() => {
    // Karma loads the real modern theme stylesheet; applying the theme
    // classes resolves the chart's themed tokens to concrete values.
    document.body.classList.add('sky-theme-modern', 'sky-theme-brand-base');

    TestBed.configureTestingModule({
      imports: [TestComponent],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    destroyed = false;
  });

  afterEach(() => {
    document.body.classList.remove('sky-theme-modern', 'sky-theme-brand-base');

    if (!destroyed) {
      fixture.destroy();
    }
  });

  it('should build the data table from the axes and series', () => {
    fixture.detectChanges();

    expect(tableSvc().table()).toEqual({
      categoryLabel: 'Year',
      categories: ['2023', '2024'],
      series: [{ label: 'Acquisitions', values: ['10', '20'] }],
    });
  });

  it('should publish an accessible summary from the axes and series', () => {
    fixture.detectChanges();

    expect(tableSvc().summary()).toEqual({
      resourceKey: 'skyux_charts.chart.line.accessible_summary',
      args: [1, 2],
    });
  });

  it('should clear the accessible summary when the plot is destroyed', () => {
    fixture.detectChanges();

    const svc = tableSvc();
    expect(svc.summary()).not.toBeUndefined();

    fixture.destroy();
    destroyed = true;

    expect(svc.summary()).toBeUndefined();
  });

  it('should format the data table values using the value axis format', () => {
    component.format = 'currency';
    component.currencyCode = 'USD';
    fixture.detectChanges();

    expect(tableSvc().table()?.series[0].values).toEqual(['$10.00', '$20.00']);
  });

  it('should render a null value as a gap and an empty data table cell', () => {
    component.values = [10, null];
    fixture.detectChanges();

    expect(requireChart().data.datasets[0].data).toEqual([10, null]);
    expect(tableSvc().table()?.series[0].values).toEqual(['10', '']);
  });

  it('should warn when a series length does not match the categories', () => {
    const warnSpy = spyOn(TestBed.inject(SkyLogService), 'warn');

    component.values = [10];
    fixture.detectChanges();

    expect(warnSpy).toHaveBeenCalledWith(
      'The <sky-chart-line-series> labeled "Acquisitions" has 1 values, but ' +
        'the category axis has 2 categories. Values align to categories by ' +
        'index, so each series must provide one value per category.',
    );
  });

  it('should not warn when every series length matches the categories', () => {
    const warnSpy = spyOn(TestBed.inject(SkyLogService), 'warn');

    fixture.detectChanges();

    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('should not build a table or chart without a category axis', () => {
    component.renderCategoryAxis = false;
    fixture.detectChanges();

    expect(tableSvc().table()).toBeUndefined();
    expect(tableSvc().summary()).toBeUndefined();
    expect(getChart()).toBeUndefined();

    // Covers the destroy path when no chart was created.
    fixture.destroy();
    destroyed = true;
  });

  it('should not build a table or chart without a series', () => {
    component.renderSeries = false;
    fixture.detectChanges();

    expect(tableSvc().table()).toBeUndefined();
    expect(getChart()).toBeUndefined();
  });

  it('should not build a table or chart without a value axis', () => {
    component.renderValueAxis = false;
    fixture.detectChanges();

    expect(tableSvc().table()).toBeUndefined();
    expect(getChart()).toBeUndefined();
  });

  it('should create a line chart from the axes and series', () => {
    fixture.detectChanges();

    const chart = requireChart();
    expect(chart.data.labels).toEqual(['2023', '2024']);
    expect(chart.data.datasets[0].label).toBe('Acquisitions');
    expect(chart.data.datasets[0].data).toEqual([10, 20]);
    expect(chart.data.datasets[0].yAxisID).toBe('value');
    expect(chart.data.datasets[0].xAxisID).toBe('category');

    const category = getScale(chart, 'category');
    const value = getScale(chart, 'value');
    expect(category.type).toBe('category');
    expect(category.position).toBe('bottom');
    // Line charts render the full background grid, so the category axis's
    // grid lines draw across the chart area.
    expect(category.grid.drawOnChartArea).toBe(true);
    expect(value.position).toBe('left');
    expect(value.grid.drawOnChartArea).toBe(true);
  });

  it('should copy the series values before handing them to Chart.js', () => {
    const values = [10, 20];
    component.values = values;
    fixture.detectChanges();

    // Chart.js mutates the arrays it is given, so the dataset must be a copy
    // of the input, not the input itself.
    expect(requireChart().data.datasets[0].data).not.toBe(values);
  });

  it('should assign each series a categorical data-visualization color', () => {
    component.renderSecondSeries = true;
    fixture.detectChanges();

    const [first, second] = requireChart().data.datasets;
    expect(typeof first.borderColor).toBe('string');
    expect(first.backgroundColor).toBe(first.borderColor);
    expect(second.borderColor).not.toBe(first.borderColor);
  });

  it('should hide the legend when there is a single series', () => {
    fixture.detectChanges();

    expect(requireChart().options.plugins?.legend?.display).toBe(false);
  });

  it('should show the legend when there are multiple series', () => {
    component.renderSecondSeries = true;
    fixture.detectChanges();

    expect(requireChart().options.plugins?.legend?.display).toBe(true);
  });

  it('should format axis ticks using the value axis format', () => {
    fixture.detectChanges();

    const value = getScale(requireChart(), 'value');
    expect(value.ticks.callback(1234)).toBe('1,234');
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

  it('should apply the themed default height to the chart', () => {
    fixture.detectChanges();

    expect(getChartContainerHeight()).toMatch(/^clamp\(/);
  });

  it('should default the value axis to a linear scale', () => {
    fixture.detectChanges();

    expect(getScale(requireChart(), 'value').type).toBe('linear');
  });

  it('should use a logarithmic scale when specified', () => {
    component.valueScaleType = 'logarithmic';
    fixture.detectChanges();

    expect(getScale(requireChart(), 'value').type).toBe('logarithmic');
  });

  it('should update an existing chart when inputs change', async () => {
    fixture.detectChanges();

    const chart = requireChart();
    component.values = [30, 40];
    fixture.detectChanges();

    // The chart updates in an `afterRenderEffect`, so wait for render
    // effects to flush before asserting.
    await fixture.whenStable();

    expect(getChart()).toBe(chart);
    expect(chart.data.datasets[0].data).toEqual([30, 40]);
  });

  it('should destroy the chart and clear the table when destroyed', () => {
    fixture.detectChanges();

    const canvas = getCanvas();
    const svc = tableSvc();
    expect(Chart.getChart(canvas)).toBeTruthy();

    fixture.destroy();

    expect(Chart.getChart(canvas)).toBeUndefined();
    expect(svc.table()).toBeUndefined();
    destroyed = true;
  });

  describe('a11y', () => {
    it('should be accessible with a single series', async () => {
      await fixture.whenStable();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible with multiple series and a legend', async () => {
      component.renderSecondSeries = true;
      await fixture.whenStable();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});

describe('Chart line component outside a sky-chart', () => {
  @Component({
    imports: [
      SkyChartLine,
      SkyChartAxisCategory,
      SkyChartAxisValue,
      SkyChartLineSeries,
    ],
    template: `
      <sky-chart-line>
        <sky-chart-axis-category labelText="Year" [categories]="categories" />
        <sky-chart-axis-value labelText="Value" />
        <sky-chart-line-series labelText="Series" [values]="values" />
      </sky-chart-line>
    `,
  })
  class StandaloneComponent {
    public categories = ['2023', '2024'];
    public values = [10, 20];
  }

  it('should throw when the plot is not inside a sky-chart', () => {
    TestBed.configureTestingModule({ imports: [StandaloneComponent] });

    expect(() => TestBed.createComponent(StandaloneComponent)).toThrowError(
      'The <sky-chart-line> component must be rendered inside a <sky-chart> ' +
        'component.',
    );
  });
});

describe('Chart line component with a theme service', () => {
  it('should rebuild the chart when the theme settings change', async () => {
    const currentSettings = new SkyThemeSettings(
      SkyTheme.presets.default,
      SkyThemeMode.presets.light,
    );
    const settingsChange = new ReplaySubject<SkyThemeSettingsChange>(1);
    settingsChange.next({ currentSettings } as SkyThemeSettingsChange);

    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [{ provide: SkyThemeService, useValue: { settingsChange } }],
    });

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const canvas = fixture.nativeElement.querySelector('canvas');
    const chart = Chart.getChart(canvas);
    expect(chart).toBeTruthy();

    const updateSpy = spyOn(chart as Chart, 'update').and.callThrough();

    // A new theme rebuilds the config, updating the existing chart in place
    // rather than recreating it. A distinct settings instance is required —
    // the theme signal skips reference-equal emissions — and the update runs
    // in an `afterRenderEffect`, so wait for render effects to flush.
    settingsChange.next({
      currentSettings: new SkyThemeSettings(
        SkyTheme.presets.modern,
        SkyThemeMode.presets.light,
      ),
    } as SkyThemeSettingsChange);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(updateSpy).toHaveBeenCalled();
    expect(Chart.getChart(canvas)).toBe(chart);

    fixture.destroy();
  });

  it('should recompute the height when the theme settings change', async () => {
    const settingsChange = new ReplaySubject<SkyThemeSettingsChange>(1);
    settingsChange.next({
      currentSettings: new SkyThemeSettings(
        SkyTheme.presets.default,
        SkyThemeMode.presets.light,
      ),
    } as SkyThemeSettingsChange);

    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [{ provide: SkyThemeService, useValue: { settingsChange } }],
    });

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const plot = fixture.nativeElement.querySelector(
      'sky-chart-line',
    ) as HTMLElement;
    const container = fixture.nativeElement.querySelector(
      'sky-chart-js',
    ) as HTMLElement;
    const initialHeight = container.style.height;

    // Resolving theme styles reads the DOM directly and is not reactive, so
    // changing a themed custom property the height derives from is only picked
    // up when the theme signal invalidates the height computation. A distinct
    // settings instance is required — the theme signal skips reference-equal
    // emissions.
    plot.style.setProperty('--sky-chart-height-viewport', '33vh');

    settingsChange.next({
      currentSettings: new SkyThemeSettings(
        SkyTheme.presets.modern,
        SkyThemeMode.presets.light,
      ),
    } as SkyThemeSettingsChange);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(container.style.height).not.toBe(initialHeight);
    expect(container.style.height).toContain('33vh');

    fixture.destroy();
  });
});
