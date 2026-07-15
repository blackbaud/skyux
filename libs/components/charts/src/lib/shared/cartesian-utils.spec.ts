import { SkyChartAxisCategory } from '../chart-axes/chart-axis-category';
import { SkyChartAxisValue } from '../chart-axes/chart-axis-value';

import { type SkyChartCartesianScaleType } from './cartesian-scale-type';
import { buildCartesianScales } from './cartesian-utils';
import { createThemeStylesFixture } from './fixtures/theme-styles-fixture';

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
    scaleType: SkyChartCartesianScaleType,
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
    scaleType: SkyChartCartesianScaleType,
    stacked?: boolean,
  ): Record<string, ScaleProbe> {
    return buildCartesianScales({
      categoryAxis: createCategoryAxis(),
      valueAxis: createValueAxis(scaleType),
      isHorizontal: false,
      stacked,
      themeStyles: createThemeStylesFixture(),
    }) as unknown as Record<string, ScaleProbe>;
  }

  it('should default to an unstacked layout when "stacked" is omitted', () => {
    const scales = build('linear');

    expect(scales['category'].stacked).toBe(false);
    expect(scales['value'].stacked).toBe(false);
  });
});
