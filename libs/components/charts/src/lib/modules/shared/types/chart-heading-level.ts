import { numberAttribute } from '@angular/core';

/**
 * The allowed heading levels for charts, corresponding to the semantic heading levels in HTML.
 */
export type SkyChartHeadingLevel = 2 | 3 | 4 | 5;

/**
 * Type guard to determine if a value is a valid SkyChartHeadingLevel.
 * @param value
 */
export function isSkyChartHeadingLevel(
  value: unknown,
): value is SkyChartHeadingLevel {
  return value === 2 || value === 3 || value === 4 || value === 5;
}

/**
 * The default heading level for charts.
 */
export const DefaultHeadingLevel: SkyChartHeadingLevel = 3;

/**
 * Transforms a value (typically a string) to a SkyChartHeadingLevel.
 *
 * @param value Value to be transformed.
 * @see [Built-in transformations](guide/components/inputs#built-in-transformations)
 */
export function headingLevelInputTransformer(
  value: unknown,
): SkyChartHeadingLevel {
  const numberValue = numberAttribute(value, DefaultHeadingLevel);
  if (isSkyChartHeadingLevel(numberValue)) {
    return numberValue;
  }

  return DefaultHeadingLevel;
}
