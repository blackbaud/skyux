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
import Chart, { type TooltipItem } from 'chart.js/auto';
import { ReplaySubject } from 'rxjs';

import { SkyChartAxisCategory } from '../chart-axis/chart-axis-category';
import { SkyChartAxisValue } from '../chart-axis/chart-axis-value';
import { SkyChartTableService } from '../chart-table/chart-table-service';
import { SkyChart } from '../chart/chart';
import { SkyChartValueFormat } from '../shared/value-format';

import { SkyChartBar } from './chart-bar';
import { SkyChartBarOrientation } from './chart-bar-orientation';
import { SkyChartBarSeries } from './chart-bar-series';
import { SkyChartBarSeriesLayout } from './chart-bar-series-layout';
import { type SkyChartBarSeriesValue } from './chart-bar-series-value';

type ScaleProbe = {
  type: string;
  position: string;
  stacked?: boolean;
  grid: { drawOnChartArea: boolean };
  ticks: { callback: (value: number | string) => string };
};

@Component({
  imports: [
    SkyChart,
    SkyChartBar,
    SkyChartAxisCategory,
    SkyChartAxisValue,
    SkyChartBarSeries,
  ],
  template: `
    <sky-chart headingText="Test chart">
      @if (renderChart) {
        <sky-chart-bar
          [orientation]="orientation"
          [seriesLayout]="seriesLayout"
        >
          @if (renderCategoryAxis) {
            <sky-chart-axis-category
              labelText="Year"
              [categories]="categories"
            />
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
            <sky-chart-bar-series
              [labelText]="seriesLabel"
              [stackId]="seriesStack"
              [values]="values"
            />
          }
          @if (renderSecondSeries) {
            <sky-chart-bar-series
              labelText="Divestitures"
              [stackId]="secondSeriesStack"
              [values]="values"
            />
          }
        </sky-chart-bar>
      }
    </sky-chart>
  `,
})
class TestComponent {
  @ViewChild(SkyChartBar)
  public chartBar!: SkyChartBar;

  public categories: (string | number)[] = ['2023', '2024'];
  public currencyCode: string | undefined;
  public format: SkyChartValueFormat | undefined;
  public orientation: SkyChartBarOrientation = 'vertical';
  public renderCategoryAxis = true;
  public renderChart = true;
  public renderSeries = true;
  public renderSecondSeries = false;
  public renderValueAxis = true;
  public seriesLabel = 'Acquisitions';
  public seriesStack: string | undefined;
  public secondSeriesStack: string | undefined;
  public seriesLayout: SkyChartBarSeriesLayout = 'grouped';
  public valueScaleType: 'linear' | 'logarithmic' = 'linear';
  public values: SkyChartBarSeriesValue[] = [10, 20];
}

describe('Chart bar component', () => {
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

  function rootFontSize(): number {
    return Number.parseFloat(
      getComputedStyle(document.documentElement).fontSize,
    );
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
    raw?: unknown,
  ): TooltipItem<'bar'> {
    return {
      datasetIndex,
      dataset: { label },
      parsed: {
        x: direction === 'x' ? value : 0,
        y: direction === 'y' ? value : 0,
      },
      raw,
    } as unknown as TooltipItem<'bar'>;
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
      resourceKey: 'skyux_charts.chart.bar.accessible_summary',
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

  it('should render a floating bar from a [start, end] range', () => {
    const range: [number, number] = [2, 5];
    component.values = [range, 10];
    fixture.detectChanges();

    const data = requireChart().data.datasets[0].data;
    expect(data).toEqual([[2, 5], 10]);

    // Chart.js mutates the arrays it is given, so the range must be a copy of
    // the input, not the input itself.
    expect(data[0]).not.toBe(range);
  });

  it('should format a floating bar range in the data table', () => {
    component.values = [[2, 5], 10];
    component.format = 'currency';
    component.currencyCode = 'USD';
    fixture.detectChanges();

    expect(tableSvc().table()?.series[0].values).toEqual([
      '$2.00 – $5.00',
      '$10.00',
    ]);
  });

  it('should format the tooltip label for a floating bar range', () => {
    fixture.detectChanges();

    const label = getTooltipLabel(requireChart());
    expect(label(tooltipContext(0, 'Acquisitions', 5, 'y', [2, 5]))).toBe(
      'Acquisitions: 2 – 5',
    );
  });

  it('should warn when a series length does not match the categories', () => {
    const warnSpy = spyOn(TestBed.inject(SkyLogService), 'warn');

    component.values = [10];
    fixture.detectChanges();

    expect(warnSpy).toHaveBeenCalledWith(
      'The <sky-chart-bar-series> labeled "Acquisitions" has 1 values, but ' +
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

  it('should create a vertical bar chart from the axes and series', () => {
    fixture.detectChanges();

    const chart = requireChart();
    expect(chart.data.labels).toEqual(['2023', '2024']);
    expect(chart.data.datasets[0].label).toBe('Acquisitions');
    expect(chart.data.datasets[0].data).toEqual([10, 20]);
    expect(chart.options.indexAxis).toBe('x');
    expect(chart.data.datasets[0].yAxisID).toBe('value');
    expect(chart.data.datasets[0].xAxisID).toBe('category');

    const category = getScale(chart, 'category');
    const value = getScale(chart, 'value');
    expect(category.position).toBe('bottom');
    expect(category.grid.drawOnChartArea).toBe(false);
    expect(value.position).toBe('left');
    expect(value.grid.drawOnChartArea).toBe(true);
  });

  it('should not stack the scales by default', () => {
    fixture.detectChanges();

    const chart = requireChart();
    expect(getScale(chart, 'category').stacked).toBe(false);
    expect(getScale(chart, 'value').stacked).toBe(false);
  });

  it('should stack the category and value scales when seriesLayout is stacked', () => {
    component.seriesLayout = 'stacked';
    fixture.detectChanges();

    const chart = requireChart();
    expect(getScale(chart, 'category').stacked).toBe(true);
    expect(getScale(chart, 'value').stacked).toBe(true);
  });

  it('should assign each series its stack group when seriesLayout is stacked', () => {
    component.seriesLayout = 'stacked';
    component.renderSecondSeries = true;
    component.seriesStack = 'Stack 0';
    component.secondSeriesStack = 'Stack 1';
    fixture.detectChanges();

    const chart = requireChart();
    expect(chart.data.datasets[0].stack).toBe('Stack 0');
    expect(chart.data.datasets[1].stack).toBe('Stack 1');
  });

  it('should leave a series without a stack group unset', () => {
    component.seriesLayout = 'stacked';
    fixture.detectChanges();

    expect(requireChart().data.datasets[0].stack).toBeUndefined();
  });

  it('should ignore the stack group when seriesLayout is grouped', () => {
    component.seriesStack = 'Stack 0';
    fixture.detectChanges();

    expect(requireChart().data.datasets[0].stack).toBeUndefined();
  });

  it('should assign the series a categorical data-visualization color', () => {
    fixture.detectChanges();

    const dataset = requireChart().data.datasets[0];
    expect(typeof dataset.backgroundColor).toBe('string');
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

  it('should use internal scale keys for the category and value scales', () => {
    fixture.detectChanges();

    const chart = requireChart();
    expect(getScale(chart, 'category').type).toBe('category');
    expect(getScale(chart, 'value').type).toBe('linear');
    expect(chart.data.datasets[0].yAxisID).toBe('value');
  });

  it('should format axis ticks using the value axis format', () => {
    fixture.detectChanges();

    const value = getScale(requireChart(), 'value');
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
    const value = chart.options.scales?.['value'] as unknown as StyleProbe;

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
    expect(chart.data.datasets[0].xAxisID).toBe('value');
    expect(chart.data.datasets[0].yAxisID).toBe('category');
    expect(getScale(chart, 'category').position).toBe('left');
    expect(getScale(chart, 'value').position).toBe('bottom');
  });

  it('should apply the themed default height to a vertical chart', () => {
    fixture.detectChanges();

    expect(getChartContainerHeight()).toMatch(/^clamp\(/);
  });

  it('should cap the vertical bar thickness', () => {
    fixture.detectChanges();

    expect(requireChart().data.datasets[0].maxBarThickness).toBe(
      7.5 * rootFontSize(),
    );
    expect(requireChart().data.datasets[0].barThickness).toBeUndefined();
  });

  it('should keep whitespace around a sparse vertical chart', () => {
    // The default fixture renders 2 categories (few).
    fixture.detectChanges();

    expect(requireChart().data.datasets[0].categoryPercentage).toBe(0.4);
    expect(requireChart().data.datasets[0].barPercentage).toBe(0.85);
  });

  it('should widen the fill for a moderate vertical chart', () => {
    component.categories = Array.from({ length: 7 }, (_, i) => `${i}`);
    component.values = Array.from({ length: 7 }, () => 10);
    fixture.detectChanges();

    expect(requireChart().data.datasets[0].categoryPercentage).toBe(0.7);
  });

  it('should widen the fill for a dense vertical chart', () => {
    component.categories = Array.from({ length: 12 }, (_, i) => `${i}`);
    component.values = Array.from({ length: 12 }, () => 10);
    fixture.detectChanges();

    expect(requireChart().data.datasets[0].categoryPercentage).toBe(0.95);
  });

  it('should size a horizontal chart from its content', () => {
    component.orientation = 'horizontal';
    fixture.detectChanges();

    const height = getChartContainerHeight();
    expect(height).toMatch(/^\d+(\.\d+)?px$/);
    expect(Number.parseFloat(height)).toBeGreaterThanOrEqual(
      11.25 * rootFontSize(),
    );
  });

  it('should set an explicit bar thickness on a horizontal chart', () => {
    component.orientation = 'horizontal';
    fixture.detectChanges();

    // Few bars render at the full (max) thickness, and the explicit thickness
    // replaces the cap so Chart.js does not auto-size the bars thinner.
    expect(requireChart().data.datasets[0].barThickness).toBe(
      1 * rootFontSize(),
    );
    expect(requireChart().data.datasets[0].maxBarThickness).toBeUndefined();
  });

  it('should taper the bar thickness for a dense horizontal chart', () => {
    component.orientation = 'horizontal';
    component.categories = Array.from({ length: 40 }, (_, i) => `${i}`);
    component.values = Array.from({ length: 40 }, () => 10);
    fixture.detectChanges();

    // Past the taper range every bar renders at the minimum thickness.
    expect(requireChart().data.datasets[0].barThickness).toBe(
      0.75 * rootFontSize(),
    );
  });

  it('should use one bar per category for a stacked horizontal chart', () => {
    component.orientation = 'horizontal';
    component.seriesLayout = 'stacked';
    component.renderSecondSeries = true;
    fixture.detectChanges();

    expect(getChartContainerHeight()).toMatch(/^\d+(\.\d+)?px$/);
  });

  it('should reserve a row for each stack group of a stacked horizontal chart', () => {
    component.orientation = 'horizontal';
    component.seriesLayout = 'stacked';
    component.renderSecondSeries = true;
    // Enough categories that the heights clear the minimum floor, so the extra
    // stack group's rows are reflected rather than clamped away.
    component.categories = Array.from({ length: 12 }, (_, i) => `${i}`);
    component.values = Array.from({ length: 12 }, () => 10);
    fixture.detectChanges();

    // Both series accumulate into a single bar per category.
    const singleStackHeight = Number.parseFloat(getChartContainerHeight());

    // Distinct stack groups render as separate bars, so each category needs a
    // row per group.
    component.seriesStack = 'West';
    component.secondSeriesStack = 'East';
    fixture.detectChanges();

    const groupedStackHeight = Number.parseFloat(getChartContainerHeight());
    expect(groupedStackHeight).toBeGreaterThan(singleStackHeight);
  });

  it('should grow taller for a dense horizontal chart', () => {
    component.orientation = 'horizontal';
    component.categories = Array.from({ length: 12 }, (_, i) => `${i}`);
    component.values = Array.from({ length: 12 }, () => 10);
    fixture.detectChanges();

    const denseHeight = Number.parseFloat(getChartContainerHeight());
    expect(denseHeight).toBeGreaterThan(11.25 * rootFontSize());
  });

  it('should size a horizontal chart by the category count, not the series length', () => {
    // Enough categories that the computed height exceeds the minimum clamp.
    const categories = Array.from({ length: 12 }, (_, i) => `${2013 + i}`);

    component.orientation = 'horizontal';
    component.categories = categories;
    component.values = [10];
    fixture.detectChanges();

    const sparseHeight = getChartContainerHeight();

    component.values = categories.map((_, i) => i * 10);
    fixture.detectChanges();

    expect(getChartContainerHeight()).toBe(sparseHeight);
  });

  it('should add legend space to a multi-series horizontal chart', () => {
    component.orientation = 'horizontal';
    // Use enough categories that the height exceeds the minimum floor, so the
    // legend's contribution is visible rather than clamped away.
    component.categories = Array.from({ length: 12 }, (_, i) => `${i}`);
    component.values = Array.from({ length: 12 }, () => 10);
    fixture.detectChanges();

    const singleSeriesHeight = Number.parseFloat(getChartContainerHeight());

    component.renderSecondSeries = true;
    fixture.detectChanges();

    const multiSeriesHeight = Number.parseFloat(getChartContainerHeight());
    expect(multiSeriesHeight).toBeGreaterThan(singleSeriesHeight);
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

  it('should keep only power-of-ten gridlines on a logarithmic scale', async () => {
    component.valueScaleType = 'logarithmic';
    component.values = [1, 8000];
    fixture.detectChanges();
    await fixture.whenStable();

    const ticks = requireChart().scales['value'].ticks.map(
      (tick) => tick.value,
    );

    expect(ticks.length).toBeGreaterThanOrEqual(2);

    for (const value of ticks) {
      const magnitude = Math.log10(value);
      expect(magnitude)
        .withContext(`tick ${value}`)
        .toBe(Math.round(magnitude));
    }
  });

  it('should keep the generated logarithmic ticks when the range spans fewer than two decades', async () => {
    component.valueScaleType = 'logarithmic';
    component.values = [4, 6];
    fixture.detectChanges();
    await fixture.whenStable();

    const ticks = requireChart().scales['value'].ticks.map(
      (tick) => tick.value,
    );

    // Intermediate (non-decade) ticks survive so the axis stays labeled.
    expect(
      ticks.some((value) => {
        const magnitude = Math.log10(value);
        return magnitude !== Math.round(magnitude);
      }),
    ).toBe(true);
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

    it('should be accessible when stacked', async () => {
      component.seriesLayout = 'stacked';
      component.renderSecondSeries = true;
      component.seriesStack = 'West';
      component.secondSeriesStack = 'East';
      await fixture.whenStable();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when horizontal', async () => {
      component.orientation = 'horizontal';
      await fixture.whenStable();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});

describe('Chart bar component in the default theme', () => {
  @Component({
    imports: [
      SkyChart,
      SkyChartBar,
      SkyChartAxisCategory,
      SkyChartAxisValue,
      SkyChartBarSeries,
    ],
    template: `
      <sky-chart headingText="Sales">
        <sky-chart-bar>
          <sky-chart-axis-category labelText="Year" [categories]="categories" />
          <sky-chart-axis-value labelText="Value" />
          <sky-chart-bar-series labelText="Series" [values]="values" />
        </sky-chart-bar>
      </sky-chart>
    `,
  })
  class WrappedComponent {
    public categories = ['2023', '2024'];
    public values = [10, 20];
  }

  it('should theme the chart from the wrapper\u2019s default-theme overrides', async () => {
    TestBed.configureTestingModule({
      imports: [WrappedComponent],
    });

    // No modern theme classes: the default theme is active, and the
    // `--sky-override-chart-*` values on `sky-chart` inherit to the plot.
    const fixture = TestBed.createComponent(WrappedComponent);
    fixture.detectChanges();

    // The chart is created in an `afterRenderEffect`, so wait for render
    // effects to flush before querying it.
    await fixture.whenStable();

    const canvas = fixture.nativeElement.querySelector('canvas');
    const chart = Chart.getChart(canvas) as Chart<'bar'> | undefined;

    if (!chart) {
      throw new Error('Expected a chart to have been created.');
    }

    const ticks = chart.options.scales?.['category']?.ticks as {
      color?: string;
    };

    expect(ticks.color).toBe('#212327');

    fixture.destroy();
  });

  it('should be accessible as a full sky-chart composition', async () => {
    TestBed.configureTestingModule({ imports: [WrappedComponent] });

    const fixture = TestBed.createComponent(WrappedComponent);

    // Render, then re-render after the async library resources resolve so
    // the context menu button receives its accessible name.
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    await expectAsync(fixture.nativeElement).toBeAccessible();

    fixture.destroy();
  });
});

describe('Chart bar component outside a sky-chart', () => {
  @Component({
    imports: [
      SkyChartBar,
      SkyChartAxisCategory,
      SkyChartAxisValue,
      SkyChartBarSeries,
    ],
    template: `
      <sky-chart-bar>
        <sky-chart-axis-category labelText="Year" [categories]="categories" />
        <sky-chart-axis-value labelText="Value" />
        <sky-chart-bar-series labelText="Series" [values]="values" />
      </sky-chart-bar>
    `,
  })
  class StandaloneComponent {
    public categories = ['2023', '2024'];
    public values = [10, 20];
  }

  it('should throw when the plot is not inside a sky-chart', () => {
    TestBed.configureTestingModule({ imports: [StandaloneComponent] });

    expect(() => TestBed.createComponent(StandaloneComponent)).toThrowError(
      'The <sky-chart-bar> component must be rendered inside a <sky-chart> ' +
        'component.',
    );
  });
});

describe('Chart bar component with a theme service', () => {
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
});
