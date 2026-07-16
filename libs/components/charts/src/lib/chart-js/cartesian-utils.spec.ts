import { SkyChartAxisCategory } from '../chart-axis/chart-axis-category';
import { SkyChartAxisValue } from '../chart-axis/chart-axis-value';

import { createThemeStylesFixture } from '../shared/fixtures/theme-styles-fixture';
import { type SkyChartValueScaleType } from '../shared/value-scale-type';

import { buildCartesianScales } from './cartesian-utils';

type ScaleProbe = {
  stacked: boolean;
  min: number | undefined;
  max: number | undefined;
};

describe('buildCartesianScales', () => {
  function createCategoryAxis(): SkyChartAxisCategory {
    return {
      labelHidden: () => false,
      labelText: () => 'Category',
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
  ): Record<string, ScaleProbe> {
    return buildCartesianScales({
      categoryAxis: createCategoryAxis(),
      valueAxis: createValueAxis(scaleType, bounds),
      isHorizontal: false,
      isStacked: stacked,
      themeStyles: createThemeStylesFixture(),
    }) as unknown as Record<string, ScaleProbe>;
  }

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
});
