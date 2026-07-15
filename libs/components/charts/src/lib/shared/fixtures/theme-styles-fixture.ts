import { type SkyChartThemeStyles } from '../chart-theme-styles';

/**
 * Creates a fully-populated theme styles object for specs that exercise the
 * config builders without resolving real CSS.
 */
export function createThemeStylesFixture(
  overrides?: Partial<SkyChartThemeStyles>,
): SkyChartThemeStyles {
  return {
    font: {
      family: 'Arial',
      size: 15,
      weight: 400,
      emphasizedWeight: 700,
      lineHeight: 1.5,
    },
    text: {
      color: '#111111',
      deemphasizedColor: '#222222',
    },
    axis: {
      lineColor: '#333333',
      gridlineColor: '#444444',
      tickLength: 12,
      titleGap: 4,
    },
    series: {
      categoricalPalette: ['#555555', '#666666'],
    },
    tooltip: {
      backgroundColor: '#ffffff',
      borderColor: '#777777',
      borderWidth: 1,
      cornerRadius: 6,
      inset: { top: 8, right: 12, bottom: 8, left: 12 },
      iconSize: 16,
      iconGap: 4,
      titleGap: 8,
      bodyGap: 0,
    },
    bar: {
      borderColor: '#ffffff',
      borderRadius: 2,
    },
    ...overrides,
  };
}
