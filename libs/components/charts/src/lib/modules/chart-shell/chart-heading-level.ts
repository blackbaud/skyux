export type SkyChartHeadingLevel = 2 | 3 | 4 | 5;

export function isSkyChartHeadingLevel(
  value: unknown,
): value is SkyChartHeadingLevel {
  return value === 2 || value === 3 || value === 4 || value === 5;
}
