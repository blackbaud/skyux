import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect, expectAsync } from '@skyux-sdk/testing';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  type SkyThemeSettingsChange,
} from '@skyux/theme';
import { Chart, type TooltipItem } from 'chart.js';
import { ReplaySubject } from 'rxjs';

import { SkyChartTableService } from '../chart-table/chart-table-service';
import { SkyChart } from '../chart/chart';
import { SkyChartValueFormat } from '../shared/value-format';

import { SkyChartPie } from './chart-pie';
import { SkyChartPieDisplayMode } from './chart-pie-display-mode';
import { SkyChartPieSlice } from './chart-pie-slice';

@Component({
  imports: [SkyChart, SkyChartPie, SkyChartPieSlice],
  template: `
    <sky-chart headingText="Test chart">
      @if (renderChart) {
        <sky-chart-pie
          categoryLabelText="Region"
          valueLabelText="Sales"
          [currencyCode]="currencyCode"
          [digits]="digits"
          [displayMode]="displayMode"
          [valueFormat]="valueFormat"
        >
          @for (slice of slices; track slice.label) {
            <sky-chart-pie-slice
              [labelText]="slice.label"
              [value]="slice.value"
            />
          }
        </sky-chart-pie>
      }
    </sky-chart>
  `,
})
class TestComponent {
  @ViewChild(SkyChartPie)
  public chartPie!: SkyChartPie;

  public currencyCode: string | undefined;
  public digits: number | undefined;
  public displayMode: SkyChartPieDisplayMode = 'pie';
  public renderChart = true;
  public slices: { label: string; value: number }[] = [
    { label: 'North', value: 10 },
    { label: 'South', value: 20 },
  ];
  public valueFormat: SkyChartValueFormat | undefined;
}

describe('Chart pie component', () => {
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

  function getChart(): Chart<'pie'> | undefined {
    return Chart.getChart(getCanvas()) as Chart<'pie'> | undefined;
  }

  function requireChart(): Chart<'pie'> {
    const chart = getChart();

    if (!chart) {
      throw new Error('Expected a chart to have been created.');
    }

    return chart;
  }

  function getTooltipLabel(
    chart: Chart<'pie'>,
  ): (context: TooltipItem<'pie'>) => string {
    return chart.options.plugins?.tooltip?.callbacks?.label as (
      context: TooltipItem<'pie'>,
    ) => string;
  }

  function tooltipContext(label: string, value: number): TooltipItem<'pie'> {
    return { label, parsed: value } as unknown as TooltipItem<'pie'>;
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

  it('should build the data table from the slices', () => {
    fixture.detectChanges();

    expect(tableSvc().table()).toEqual({
      categoryLabel: 'Region',
      categories: ['North', 'South'],
      series: [{ label: 'Sales', values: ['10', '20'] }],
    });
  });

  it('should publish an accessible summary from the slices', () => {
    fixture.detectChanges();

    expect(tableSvc().summary()).toEqual({
      resourceKey: 'skyux_charts.chart.pie.accessible_summary',
      args: [2],
    });
  });

  it('should publish a donut accessible summary in the donut display mode', () => {
    component.displayMode = 'donut';
    fixture.detectChanges();

    expect(tableSvc().summary()).toEqual({
      resourceKey: 'skyux_charts.chart.donut.accessible_summary',
      args: [2],
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

  it('should format the data table values using the value format', () => {
    component.valueFormat = 'currency';
    component.currencyCode = 'USD';
    fixture.detectChanges();

    expect(tableSvc().table()?.series[0].values).toEqual(['$10.00', '$20.00']);
  });

  it('should format the data table values with the given digits', () => {
    component.digits = 1;
    fixture.detectChanges();

    expect(tableSvc().table()?.series[0].values).toEqual(['10.0', '20.0']);
  });

  it('should not build a table or chart without slices', () => {
    component.slices = [];
    fixture.detectChanges();

    expect(tableSvc().table()).toBeUndefined();
    expect(tableSvc().summary()).toBeUndefined();
    expect(getCanvas()).toBeNull();

    // Covers the destroy path when no chart was created.
    fixture.destroy();
    destroyed = true;
  });

  it('should create a pie chart from the slices', () => {
    fixture.detectChanges();

    const chart = requireChart();
    expect(chart.data.labels).toEqual(['North', 'South']);
    expect(chart.data.datasets[0].label).toBe('Sales');
    expect(chart.data.datasets[0].data).toEqual([10, 20]);
    expect(chart.options.cutout).toBe(0);
  });

  it('should cut out the center in the donut display mode', () => {
    component.displayMode = 'donut';
    fixture.detectChanges();

    expect(requireChart().options.cutout).toBe('65%');
  });

  it('should assign each slice its own categorical data-visualization color', () => {
    fixture.detectChanges();

    const backgroundColor = requireChart().data.datasets[0]
      .backgroundColor as string[];

    expect(backgroundColor.length).toBe(2);
    expect(backgroundColor[0]).not.toBe(backgroundColor[1]);

    // Tokens are resolved to concrete values, never the raw property name.
    expect(backgroundColor[0]).not.toContain('--sky');
  });

  it('should cycle the categorical palette when there are more slices than colors', () => {
    component.slices = Array.from({ length: 9 }, (_, index) => ({
      label: `Slice ${index}`,
      value: index + 1,
    }));
    fixture.detectChanges();

    const backgroundColor = requireChart().data.datasets[0]
      .backgroundColor as string[];

    // The palette has 8 categorical colors, so the ninth slice wraps.
    expect(backgroundColor[8]).toBe(backgroundColor[0]);
  });

  it('should separate the slices with a themed arc border', () => {
    fixture.detectChanges();

    const arc = requireChart().options.elements?.arc;
    expect(arc?.borderWidth).toBe(1);
    expect(arc?.borderColor).not.toContain('--sky');
    expect(arc?.borderColor).toBeTruthy();
  });

  it('should show the legend', () => {
    fixture.detectChanges();

    // A pie's legend identifies its slices, so it is never hidden.
    expect(requireChart().options.plugins?.legend?.display).not.toBe(false);
  });

  it('should target the hovered slice for tooltips', () => {
    fixture.detectChanges();

    const tooltip = requireChart().options.plugins?.tooltip;
    expect(tooltip?.mode).toBe('nearest');
    expect(tooltip?.intersect).toBe(true);
  });

  it('should format the tooltip label with the slice label', () => {
    fixture.detectChanges();

    const label = getTooltipLabel(requireChart());
    expect(label(tooltipContext('North', 10))).toBe('North: 10');
  });

  it('should format the tooltip value using the value format', () => {
    component.valueFormat = 'currency';
    component.currencyCode = 'USD';
    fixture.detectChanges();

    const label = getTooltipLabel(requireChart());
    expect(label(tooltipContext('North', 10))).toBe('North: $10.00');
  });

  it('should format fractional tooltip values as percentages', () => {
    component.valueFormat = 'percent';
    fixture.detectChanges();

    const label = getTooltipLabel(requireChart());
    expect(label(tooltipContext('North', 0.25))).toBe('North: 25%');
  });

  it('should apply the themed default height', () => {
    fixture.detectChanges();

    expect(getChartContainerHeight()).toMatch(/^clamp\(/);
  });

  it('should update an existing chart when inputs change', async () => {
    fixture.detectChanges();

    const chart = requireChart();
    component.slices = [
      { label: 'North', value: 30 },
      { label: 'South', value: 40 },
    ];
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
    it('should be accessible as a pie', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible as a donut', async () => {
      component.displayMode = 'donut';
      fixture.detectChanges();
      await fixture.whenStable();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});

describe('Chart pie component in the default theme', () => {
  @Component({
    imports: [SkyChart, SkyChartPie, SkyChartPieSlice],
    template: `
      <sky-chart headingText="Sales">
        <sky-chart-pie categoryLabelText="Region" valueLabelText="Sales">
          <sky-chart-pie-slice labelText="North" [value]="10" />
          <sky-chart-pie-slice labelText="South" [value]="20" />
        </sky-chart-pie>
      </sky-chart>
    `,
  })
  class WrappedComponent {}

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
    const chart = Chart.getChart(canvas) as Chart<'pie'> | undefined;

    if (!chart) {
      throw new Error('Expected a chart to have been created.');
    }

    expect(chart.options.elements?.arc?.borderColor).toBe('#ffffff');

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

describe('Chart pie component outside a sky-chart', () => {
  @Component({
    imports: [SkyChartPie, SkyChartPieSlice],
    template: `
      <sky-chart-pie categoryLabelText="Region" valueLabelText="Sales">
        <sky-chart-pie-slice labelText="North" [value]="10" />
      </sky-chart-pie>
    `,
  })
  class StandaloneComponent {}

  it('should throw when the plot is not inside a sky-chart', () => {
    TestBed.configureTestingModule({ imports: [StandaloneComponent] });

    expect(() => TestBed.createComponent(StandaloneComponent)).toThrowError(
      'The <sky-chart-pie> component must be rendered inside a <sky-chart> ' +
        'component.',
    );
  });
});

describe('Chart pie component with a theme service', () => {
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
