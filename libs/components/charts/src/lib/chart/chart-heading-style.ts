import { numberAttribute } from '@angular/core';

/**
 * @preview
 *
 * The allowed heading styles for charts, corresponding to the font styles defined in the SKY UX design system.
 */
export type SkyChartHeadingStyle = 2 | 3 | 4 | 5;

export const DEFAULT_HEADING_STYLE: SkyChartHeadingStyle = 3 as const;

export function headingStyleInputTransformer(
  value: unknown,
): SkyChartHeadingStyle {
  const numberValue = numberAttribute(value, DEFAULT_HEADING_STYLE);

  if (isHeadingStyle(numberValue)) {
    return numberValue;
  }

  return DEFAULT_HEADING_STYLE;
}

function isHeadingStyle(value: unknown): value is SkyChartHeadingStyle {
  return value === 2 || value === 3 || value === 4 || value === 5;
}
