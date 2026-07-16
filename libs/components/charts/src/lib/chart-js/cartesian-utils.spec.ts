import { SkyChartAxisCategory } from '../chart-axis/chart-axis-category';
import { SkyChartAxisValue } from '../chart-axis/chart-axis-value';

import { createThemeStylesFixture } from '../shared/fixtures/theme-styles-fixture';
import { type SkyChartValueScaleType } from '../shared/value-scale-type';

import { buildCartesianScales } from './cartesian-utils';

type ScaleProbe = {
  stacked: boolean;
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
  ): SkyChartAxisValue {
    return {
      scaleType: () => scaleType,
      formatValue:
        () =>
        (value: number): string =>
          `${value}`,
      labelHidden: () => false,
      labelText: () => 'Value',
    } as unknown as SkyChartAxisValue;
  }

  function build(
    scaleType: SkyChartValueScaleType,
    stacked?: boolean,
  ): Record<string, ScaleProbe> {
    return buildCartesianScales({
      categoryAxis: createCategoryAxis(),
      valueAxis: createValueAxis(scaleType),
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
});
