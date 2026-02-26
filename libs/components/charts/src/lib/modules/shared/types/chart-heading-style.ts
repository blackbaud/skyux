import { numberAttribute } from '@angular/core';

/**
 * The allowed heading styles for charts, corresponding to the font styles defined in the SKY UX design system.
 */
export type SkyChartHeadingStyle = 2 | 3 | 4 | 5;

/**
 * Type guard to determine if a value is a valid SkyChartHeadingStyle.
 * @param value
 */
export function isSkyChartHeadingStyle(
  value: unknown,
): value is SkyChartHeadingStyle {
  return value === 2 || value === 3 || value === 4 || value === 5;
}

/**
 * The default heading style for charts.
 */
export const DefaultHeadingStyle: SkyChartHeadingStyle = 3;

/**
 * Transforms a value (typically a string) to a SkyChartHeadingStyle.
 *
 * @param value Value to be transformed.
 * @see [Built-in transformations](guide/components/inputs#built-in-transformations)
 */
export function headingStyleInputTransformer(
  value: unknown,
): SkyChartHeadingStyle {
  const numberValue = numberAttribute(value, DefaultHeadingStyle);
  if (isSkyChartHeadingStyle(numberValue)) {
    return numberValue;
  }

  return DefaultHeadingStyle;
}
