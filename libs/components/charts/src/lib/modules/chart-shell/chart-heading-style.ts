export type SkyChartHeadingStyle = 2 | 3 | 4 | 5;

export function isSkyChartHeadingStyle(
  value: unknown,
): value is SkyChartHeadingStyle {
  return value === 2 || value === 3 || value === 4 || value === 5;
}
