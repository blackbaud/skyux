import { Component, input, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyLogService } from '@skyux/core';
import { type SkyAppLocaleInfo, SkyAppLocaleProvider } from '@skyux/i18n';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  type SkyThemeSettingsChange,
} from '@skyux/theme';
import { _adapters, Chart, type DateAdapter, type TooltipItem } from 'chart.js';
import { type Observable, of, ReplaySubject } from 'rxjs';

import { SkyChartAxisCategory } from '../chart-axis/chart-axis-category';
import { SkyChartAxisCategoryTime } from '../chart-axis/chart-axis-category-time';
import { SkyChartAxisValue } from '../chart-axis/chart-axis-value';
import { type SkyChartDataPointClickArgs } from '../chart-plot/chart-data-point-click-args';
import { SkyChartTableService } from '../chart-table/chart-table-service';
import { SkyChart } from '../chart/chart';
import { type SkyChartTimeUnit } from '../shared/time-unit';
import { SkyChartValueFormat } from '../shared/value-format';

import { SkyChartLine } from './chart-line';
import { SkyChartLineSeries } from './chart-line-series';
import { type SkyChartLineSeriesValue } from './chart-line-series-value';

type ScaleProbe = {
  type: string;
  position: string;
  offset: boolean;
  grid: { drawOnChartArea: boolean };
  ticks: { callback: (value: number | string) => string };
};

@Component({
  imports: [
    SkyChart,
    SkyChartLine,
    SkyChartAxisCategory,
    SkyChartAxisCategoryTime,
    SkyChartAxisValue,
    SkyChartLineSeries,
  ],
  template: `
    <sky-chart headingText="Test chart">
      <sky-chart-line (dataPointClick)="dataPointClick = $event">
        @if (renderCategoryAxis()) {
          @if (timeUnit(); as timeUnit) {
            <sky-chart-axis-category-time
              labelText="Year"
              [categories]="categories()"
              [timeStep]="timeStep()"
              [timeUnit]="timeUnit"
            />
          } @else {
            <sky-chart-axis-category
              labelText="Year"
              [categories]="categories()"
            />
          }
        }
        @if (renderValueAxis()) {
          <sky-chart-axis-value
            labelText="Value"
            [currencyCode]="currencyCode()"
            [format]="format()"
            [scaleType]="valueScaleType()"
          />
        }
        @if (renderSeries()) {
          <sky-chart-line-series
            [emphasized]="emphasized()"
            [labelText]="seriesLabel()"
            [values]="values()"
          />
        }
        @if (renderSecondSeries()) {
          <sky-chart-line-series labelText="Target" [values]="values()" />
        }
      </sky-chart-line>
    </sky-chart>
  `,
})
class TestComponent {
  @ViewChild(SkyChartLine)
  public chartLine!: SkyChartLine;

  public categories = input<string[]>(['2023', '2024']);
  public currencyCode = input<string | undefined>(undefined);
  public emphasized = input(false);
  public format = input<SkyChartValueFormat>('number');
  public renderCategoryAxis = input(true);
  public renderSeries = input(true);
  public renderSecondSeries = input(false);
  public renderValueAxis = input(true);
  public seriesLabel = input('Acquisitions');
  public valueScaleType = input<'linear' | 'logarithmic'>('linear');
  public timeStep = input<number | undefined>(undefined);
  public timeUnit = input<SkyChartTimeUnit | undefined>(undefined);
  public values = input<SkyChartLineSeriesValue[]>([10, 20]);

  public dataPointClick:
    SkyChartDataPointClickArgs<SkyChartLineSeriesValue> | undefined;
}

describe('Chart line component', () => {
  let fixture: ComponentFixture<TestComponent>;
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

  function getLegendButtons(): HTMLButtonElement[] {
    return Array.from(
      fixture.nativeElement.querySelectorAll('sky-chart-legend button'),
    );
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
    document.body.classList.add(
      'sky-theme-modern',
      'sky-theme-brand-base',
      'sky-theme-mode-light',
    );

    TestBed.configureTestingModule({
      imports: [TestComponent],
    });

    fixture = TestBed.createComponent(TestComponent);
    destroyed = false;
  });

  afterEach(() => {
    document.body.classList.remove(
      'sky-theme-modern',
      'sky-theme-brand-base',
      'sky-theme-mode-light',
    );

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
    fixture.componentRef.setInput('format', 'currency');
    fixture.componentRef.setInput('currencyCode', 'USD');
    fixture.detectChanges();

    expect(tableSvc().table()?.series[0].values).toEqual(['$10.00', '$20.00']);
  });

  it('should render a null value as a gap and an empty data table cell', () => {
    fixture.componentRef.setInput('values', [10, null]);
    fixture.detectChanges();

    expect(requireChart().data.datasets[0].data).toEqual([10, null]);
    expect(tableSvc().table()?.series[0].values).toEqual(['10', '']);
  });

  it('should render an undefined value as an empty data table cell', () => {
    // Loosely typed consumer data can contain `undefined` despite the types.
    fixture.componentRef.setInput('values', [
      10,
      undefined,
    ] as unknown as SkyChartLineSeriesValue[]);
    fixture.detectChanges();

    expect(tableSvc().table()?.series[0].values).toEqual(['10', '']);
  });

  it('should warn when a series length does not match the categories', () => {
    const warnSpy = spyOn(TestBed.inject(SkyLogService), 'warn');

    fixture.componentRef.setInput('values', [10]);
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
    fixture.componentRef.setInput('renderCategoryAxis', false);
    fixture.detectChanges();

    expect(tableSvc().table()).toBeUndefined();
    expect(tableSvc().summary()).toBeUndefined();
    expect(getChart()).toBeUndefined();

    // Covers the destroy path when no chart was created.
    fixture.destroy();
    destroyed = true;
  });

  it('should not build a table or chart without a series', () => {
    fixture.componentRef.setInput('renderSeries', false);
    fixture.detectChanges();

    expect(tableSvc().table()).toBeUndefined();
    expect(getChart()).toBeUndefined();
  });

  it('should not build a table or chart without a value axis', () => {
    fixture.componentRef.setInput('renderValueAxis', false);
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
    // Lines run edge to edge when there are multiple categories.
    expect(category.offset).toBe(false);
    expect(value.position).toBe('left');
    expect(value.grid.drawOnChartArea).toBe(true);
  });

  it('should offset the category axis when there is a single category', () => {
    fixture.componentRef.setInput('categories', ['2023']);
    fixture.componentRef.setInput('values', [10]);
    fixture.detectChanges();

    expect(getScale(requireChart(), 'category').offset).toBe(true);
  });

  describe('time scale', () => {
    const dates = ['2026-01-01', '2026-02-15', '2026-03-01'];

    // Intl separates some parts with narrow or non-breaking spaces.
    function normalize(text: string): string {
      return text.replace(/\s/g, ' ');
    }

    function renderTimeScale(
      timeUnit: SkyChartTimeUnit,
      timeStep?: number,
    ): void {
      fixture.componentRef.setInput('categories', dates);
      fixture.componentRef.setInput('values', [10, 20, 30]);
      fixture.componentRef.setInput('timeUnit', timeUnit);
      fixture.componentRef.setInput('timeStep', timeStep);
      fixture.detectChanges();
    }

    function getTickLabels(): string[] {
      return requireChart().scales['category'].ticks.map((tick) =>
        normalize(String(tick.label)),
      );
    }

    it('should position each category by its date', () => {
      renderTimeScale('month');

      expect(getScale(requireChart(), 'category').type).toBe('skyTime');
      expect(requireChart().data.labels).toEqual([
        new Date(2026, 0, 1).getTime(),
        new Date(2026, 1, 15).getTime(),
        new Date(2026, 2, 1).getTime(),
      ]);
    });

    it('should not register a global Chart.js date adapter', () => {
      renderTimeScale('month');

      expect(() => new _adapters._date().formats()).toThrowError(
        /not implemented/,
      );
    });

    it("should ignore a consumer's global Chart.js date adapter", () => {
      const prototype = _adapters._date.prototype as object;
      const original = Object.getOwnPropertyDescriptors(prototype);

      _adapters._date.override({
        formats: () => ({}) as ReturnType<DateAdapter['formats']>,
        format: () => 'Consumer label',
        parse: () => 0,
      });

      try {
        renderTimeScale('month');

        expect(getTickLabels()).toEqual(['Jan 2026', 'Feb 2026', 'Mar 2026']);
      } finally {
        Object.defineProperties(prototype, original);
      }
    });

    it('should label the axis once per unit, formatted for the unit', () => {
      renderTimeScale('month');

      expect(getTickLabels()).toEqual(['Jan 2026', 'Feb 2026', 'Mar 2026']);
    });

    it('should label years the same on the axis and in the data table', () => {
      fixture.componentRef.setInput('categories', [
        '2024-01-01',
        '2025-01-01',
        '2026-01-01',
      ]);
      fixture.componentRef.setInput('values', [10, 20, 30]);
      fixture.componentRef.setInput('timeUnit', 'year');
      fixture.detectChanges();

      expect(getTickLabels()).toEqual(['2024', '2025', '2026']);
      expect(tableSvc().table()?.categories).toEqual(['2024', '2025', '2026']);
    });

    it('should skip units between labels by the step size', () => {
      renderTimeScale('month', 2);

      expect(getTickLabels()).toEqual(['Jan 2026', 'Mar 2026']);
    });

    it('should show the full date in the tooltip', () => {
      renderTimeScale('month');

      expect(
        normalize(
          requireChart().scales['category'].getLabelForValue(
            new Date(2026, 1, 15).getTime(),
          ),
        ),
      ).toBe('Feb 15, 2026');
    });

    it('should show the full date in the data table', () => {
      renderTimeScale('month');

      expect(tableSvc().table()?.categories.map(String).map(normalize)).toEqual(
        ['Jan 1, 2026', 'Feb 15, 2026', 'Mar 1, 2026'],
      );
    });

    const misconfigurations: {
      description: string;
      inputs: Record<string, unknown>;
      error: string | RegExp;
    }[] = [
      ...[0, -1, 0.5, 'abc'].map((timeStep) => ({
        description: `a time step of "${timeStep}"`,
        inputs: { timeUnit: 'day', timeStep },
        error:
          `The <sky-chart-axis-category-time> has a "timeStep" of "${Number(timeStep)}", ` +
          'but it must be a positive whole number.',
      })),
      {
        description: 'a category that is not a strict date',
        inputs: {
          categories: ['2026-01-01', 'Feb 1 26'],
          timeUnit: 'month',
        },
        error: /The time category "Feb 1 26" is not a valid date/,
      },
    ];

    it('should clear a rendered chart when its time scale becomes misconfigured', async () => {
      const errorSpy = spyOn(TestBed.inject(SkyLogService), 'error');

      renderTimeScale('month');

      expect(getChart()).toBeDefined();

      fixture.componentRef.setInput('timeStep', 0);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(getChart()).toBeUndefined();
      expect(tableSvc().table()).toBeUndefined();
      expect(tableSvc().summary()).toBeUndefined();
    });

    for (const { description, inputs, error } of misconfigurations) {
      it(`should log an error and render nothing for ${description}`, () => {
        const errorSpy = spyOn(TestBed.inject(SkyLogService), 'error');

        fixture.componentRef.setInput('categories', dates);
        fixture.componentRef.setInput('values', [10, 20, 30]);

        for (const [name, value] of Object.entries(inputs)) {
          fixture.componentRef.setInput(name, value);
        }

        fixture.detectChanges();

        expect(errorSpy).toHaveBeenCalledOnceWith(
          typeof error === 'string' ? error : jasmine.stringMatching(error),
        );
        expect(getChart()).toBeUndefined();
        expect(tableSvc().table()).toBeUndefined();
        expect(tableSvc().summary()).toBeUndefined();
      });
    }
  });

  it('should highlight every series at the hovered category', () => {
    fixture.detectChanges();

    expect(requireChart().options.hover).toEqual(
      jasmine.objectContaining({ mode: 'index', intersect: false }),
    );
  });

  it('should copy the series values before handing them to Chart.js', () => {
    const values = [10, 20];
    fixture.componentRef.setInput('values', values);
    fixture.detectChanges();

    // Chart.js mutates the arrays it is given, so the dataset must be a copy
    // of the input, not the input itself.
    expect(requireChart().data.datasets[0].data).not.toBe(values);
  });

  it('should assign each series a categorical data-visualization color', () => {
    fixture.componentRef.setInput('renderSecondSeries', true);
    fixture.detectChanges();

    const [first, second] = requireChart().data.datasets;
    expect(typeof first.borderColor).toBe('string');
    expect(first.backgroundColor).toBe(first.borderColor);
    expect(second.borderColor).not.toBe(first.borderColor);
  });

  it('should not render a legend when there is a single series', () => {
    fixture.detectChanges();

    expect(getLegendButtons().length).toBe(0);
  });

  it('should emit the clicked data point', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const dataPoints: HTMLElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.sky-chart-data-point'),
    );
    dataPoints[1].click();

    expect(fixture.componentInstance.dataPointClick).toEqual({
      category: '2024',
      categoryIndex: 1,
      seriesIndex: 0,
      seriesLabelText: 'Acquisitions',
      value: 20,
    });
  });

  it('should toggle a series when its legend button is clicked', async () => {
    fixture.componentRef.setInput('renderSecondSeries', true);
    fixture.detectChanges();

    expect(
      getLegendButtons().map((button) => button.textContent?.trim()),
    ).toEqual(['Acquisitions', 'Target']);

    getLegendButtons()[1].click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(requireChart().data.datasets[0].hidden).toBe(false);
    expect(requireChart().data.datasets[1].hidden).toBe(true);
    expect(getLegendButtons()[1].getAttribute('aria-pressed')).toBe('false');
  });

  it('should widen only the emphasized series to the emphasized line width', () => {
    fixture.componentRef.setInput('renderSecondSeries', true);
    fixture.componentRef.setInput('emphasized', true);
    fixture.detectChanges();

    const [emphasized, other] = requireChart().data.datasets;

    expect(requireChart().options.elements?.line?.borderWidth).toBe(2);
    expect(emphasized.borderWidth).toBe(5);
    expect(emphasized.pointBorderWidth).toBe(5);
    expect(other.borderWidth).toBeUndefined();
    expect(other.pointBorderWidth).toBeUndefined();
  });

  it('should emphasize only the emphasized series in the data table', () => {
    fixture.componentRef.setInput('renderSecondSeries', true);
    fixture.componentRef.setInput('emphasized', true);
    fixture.detectChanges();

    const [emphasized, other] = tableSvc().table()?.series ?? [];

    expect(emphasized.emphasized).toBe(true);
    expect(other.emphasized).toBeUndefined();
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
    fixture.componentRef.setInput('seriesLabel', '');
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
    fixture.componentRef.setInput('valueScaleType', 'logarithmic');
    fixture.detectChanges();

    expect(getScale(requireChart(), 'value').type).toBe('logarithmic');
  });

  it('should update an existing chart when inputs change', async () => {
    fixture.detectChanges();

    const chart = requireChart();
    fixture.componentRef.setInput('values', [30, 40]);
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
      fixture.componentRef.setInput('renderSecondSeries', true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getLegendButtons().length).toBe(2);

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when a misconfigured time scale clears the chart', async () => {
      spyOn(TestBed.inject(SkyLogService), 'error');

      fixture.componentRef.setInput('categories', ['2026-01-01', '2026-02-01']);
      fixture.componentRef.setInput('timeUnit', 'month');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getChart()).toBeDefined();

      fixture.componentRef.setInput('timeStep', 0);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getChart()).toBeUndefined();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});

describe('Chart line component with two category axes', () => {
  @Component({
    imports: [
      SkyChart,
      SkyChartLine,
      SkyChartAxisCategory,
      SkyChartAxisCategoryTime,
      SkyChartAxisValue,
      SkyChartLineSeries,
    ],
    template: `
      <sky-chart headingText="Test chart">
        <sky-chart-line>
          <sky-chart-axis-category labelText="Year" [categories]="categories" />
          <sky-chart-axis-category-time
            labelText="Year"
            timeUnit="year"
            [categories]="categories"
          />
          <sky-chart-axis-value labelText="Value" />
          <sky-chart-line-series labelText="Series" [values]="values" />
        </sky-chart-line>
      </sky-chart>
    `,
  })
  class TwoAxesComponent {
    public categories = ['2023-01-01', '2024-01-01'];
    public values = [10, 20];
  }

  it('should log an error and render nothing', () => {
    TestBed.configureTestingModule({ imports: [TwoAxesComponent] });

    const errorSpy = spyOn(TestBed.inject(SkyLogService), 'error');
    const fixture = TestBed.createComponent(TwoAxesComponent);
    fixture.detectChanges();

    const tableSvc = fixture.debugElement
      .query(By.directive(SkyChart))
      .injector.get(SkyChartTableService);

    expect(errorSpy).toHaveBeenCalledOnceWith(
      'The <sky-chart-line> can have only one category axis.',
    );
    expect(
      Chart.getChart(fixture.nativeElement.querySelector('canvas')),
    ).toBeUndefined();
    expect(tableSvc.table()).toBeUndefined();

    fixture.destroy();
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

describe('Chart line component with a locale', () => {
  it('should format a time scale for the current locale', () => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [
        {
          provide: SkyAppLocaleProvider,
          useValue: {
            defaultLocale: 'en-US',
            getLocaleInfo: (): Observable<SkyAppLocaleInfo> =>
              of({ locale: 'de-DE' }),
          },
        },
      ],
    });

    const fixture = TestBed.createComponent(TestComponent);
    fixture.componentRef.setInput('categories', ['2026-01-15', '2026-04-01']);
    fixture.componentRef.setInput('timeUnit', 'month');
    fixture.detectChanges();

    const tableSvc = fixture.debugElement
      .query(By.directive(SkyChart))
      .injector.get(SkyChartTableService);

    expect(tableSvc.table()?.categories).toEqual([
      '15. Jan. 2026',
      '1. Apr. 2026',
    ]);

    fixture.destroy();
  });
});
