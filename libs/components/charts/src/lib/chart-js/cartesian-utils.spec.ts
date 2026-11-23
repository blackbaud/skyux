import { SkyChartAxisCategory } from '../chart-axis/chart-axis-category';
import { SkyChartAxisValue } from '../chart-axis/chart-axis-value';

import { createThemeStylesFixture } from '../shared/fixtures/theme-styles-fixture';
import { type SkyChartTimeUnit } from '../shared/time-unit';
import { type SkyChartValueScaleType } from '../shared/value-scale-type';

import { buildCartesianScales } from './cartesian-utils';

type ScaleProbe = {
  stacked: boolean;
  min: number | undefined;
  max: number | undefined;
  ticks: { autoSkip: boolean; stepSize?: number };
  type: string;
  time?: { unit: string; tooltipFormat: string };
  adapters?: { date: { locale: string } };
};

describe('buildCartesianScales', () => {
  function createCategoryAxis(time?: {
    unit: SkyChartTimeUnit;
    step?: number;
  }): SkyChartAxisCategory {
    return {
      labelHidden: () => false,
      labelText: () => 'Category',
      scaleType: () => (time ? 'time' : 'category'),
      timeUnit: () => time?.unit,
      timeStep: () => time?.step,
    } as unknown as SkyChartAxisCategory;
  }

  function createValueAxis(
    scaleType: SkyChartValueScaleType,
    bounds?: { min?: number; max?: number },
  ): SkyChartAxisValue {
    return {
      scaleType: () => scaleType,
      formatValue:
        () =>
        (value: number): string =>
          `${value}`,
      labelHidden: () => false,
      labelText: () => 'Value',
      min: () => bounds?.min,
      max: () => bounds?.max,
    } as unknown as SkyChartAxisValue;
  }

  function build(
    scaleType: SkyChartValueScaleType,
    stacked?: boolean,
    bounds?: { min?: number; max?: number },
    isHorizontal = false,
  ): Record<string, ScaleProbe> {
    return buildCartesianScales({
      categoryAxis: createCategoryAxis(),
      valueAxis: createValueAxis(scaleType, bounds),
      isHorizontal,
      isStacked: stacked,
      themeStyles: createThemeStylesFixture(),
    }) as unknown as Record<string, ScaleProbe>;
  }

  it('should build a time scale from the time scale config', () => {
    const scale = (
      buildCartesianScales({
        categoryAxis: createCategoryAxis({ unit: 'week', step: 2 }),
        valueAxis: createValueAxis('linear'),
        isHorizontal: false,
        themeStyles: createThemeStylesFixture(),
        dateAdapterOptions: { locale: 'fr-CA' },
      }) as unknown as Record<string, ScaleProbe>
    )['category'];

    expect(scale.type).toBe('skyTime');
    expect(scale.time).toEqual({ unit: 'week', tooltipFormat: 'full:week' });
    expect(scale.ticks.stepSize).toBe(2);
    expect(scale.adapters).toEqual({
      date: { locale: 'fr-CA' },
    });
  });

  it('should build a category scale by default', () => {
    const scale = (
      buildCartesianScales({
        categoryAxis: createCategoryAxis(),
        valueAxis: createValueAxis('linear'),
        isHorizontal: false,
        themeStyles: createThemeStylesFixture(),
      }) as unknown as Record<string, ScaleProbe>
    )['category'];

    expect(scale.type).toBe('category');
    expect(scale.time).toBeUndefined();
    expect(scale.adapters).toBeUndefined();
  });

  it('should default to an unstacked layout when "stacked" is omitted', () => {
    const scales = build('linear');

    expect(scales['category'].stacked).toBe(false);
    expect(scales['value'].stacked).toBe(false);
  });

  it('should apply the value axis min and max to the value scale', () => {
    const scales = build('linear', false, { min: -10, max: 100 });

    expect(scales['value'].min).toBe(-10);
    expect(scales['value'].max).toBe(100);
  });

  it('should leave the value scale bounds unset when min and max are omitted', () => {
    const scales = build('linear');

    expect(scales['value'].min).toBeUndefined();
    expect(scales['value'].max).toBeUndefined();
  });

  it('should show every category label on a horizontal chart', () => {
    const scales = build('linear', false, undefined, true);

    expect(scales['category'].ticks.autoSkip).toBeFalse();
  });

  it('should skip crowded category labels on a vertical chart', () => {
    const scales = build('linear');

    expect(scales['category'].ticks.autoSkip).toBeTrue();
  });
});
