import { SkyChartAxisCategory } from '../chart-axes/chart-axis-category';
import { SkyChartAxisValue } from '../chart-axes/chart-axis-value';

import { type SkyChartCartesianScaleType } from './cartesian-scale-type';
import { buildCartesianScales } from './cartesian-utils';

type ScaleProbe = {
  stacked: boolean;
};

describe('buildCartesianScales', () => {
  function createStyles(): CSSStyleDeclaration {
    return {
      getPropertyValue: (): string => '',
    } as unknown as CSSStyleDeclaration;
  }

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
      valueAxes: [createValueAxis(scaleType)],
      valueAxisKeys: ['value-0'],
      isHorizontal: false,
      stacked,
      styles: createStyles(),
    }) as unknown as Record<string, ScaleProbe>;
  }

  it('should default to an unstacked layout when "stacked" is omitted', () => {
    const scales = build('linear');

    expect(scales['category'].stacked).toBe(false);
    expect(scales['value-0'].stacked).toBe(false);
  });
});
