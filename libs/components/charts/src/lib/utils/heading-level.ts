import { numberAttribute } from '@angular/core';

/**
 * The allowed heading levels for charts, corresponding to the semantic heading levels in HTML.
 */
export type SkyChartHeadingLevel = 2 | 3 | 4 | 5;

export const DEFAULT_HEADING_LEVEL: SkyChartHeadingLevel = 3 as const;

export function headingLevelInputTransformer(
  value: unknown,
): SkyChartHeadingLevel {
  const numberValue = numberAttribute(value, DEFAULT_HEADING_LEVEL);

  if (isSkyChartHeadingLevel(numberValue)) {
    return numberValue;
  }

  return DEFAULT_HEADING_LEVEL;
}

function isSkyChartHeadingLevel(value: unknown): value is SkyChartHeadingLevel {
  return value === 2 || value === 3 || value === 4 || value === 5;
}
