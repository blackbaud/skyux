/**
 * Reads a CSS custom property from resolved styles, returning `fallback` when
 * the property is unset. `getPropertyValue` yields an empty string for an
 * undefined property, and Chart.js renders to a canvas that cannot read CSS
 * variables, so an unresolved token must never reach the chart.
 * @internal
 */
export function readThemeCssString(
  styles: CSSStyleDeclaration,
  property: string,
  fallback = '',
): string {
  return styles.getPropertyValue(property).trim() || fallback;
}

/**
 * Reads a numeric CSS custom property and returns it as a number, converting
 * `rem` values to pixels using the root font size. `getComputedStyle` does not
 * resolve a custom property's units, and Chart.js expects numeric pixel values
 * (font sizes, lengths, padding), so a `rem` token is converted and a token
 * that is unset or not a number falls back to `fallback`.
 * @internal
 */
export function readThemeCssNumber(
  styles: CSSStyleDeclaration,
  property: string,
  fallback: number,
): number {
  const raw = styles.getPropertyValue(property).trim();
  const value = Number.parseFloat(raw);

  if (Number.isNaN(value)) {
    return fallback;
  }

  if (raw.endsWith('rem')) {
    return (
      value *
      Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
    );
  }

  return value;
}

/**
 * Resolves the SKY categorical data-visualization palette for the active theme
 * (`--sky-color-viz-category-1` through `-8`). Chart.js cannot read CSS
 * variables, so the tokens are resolved to concrete colors that series cycle
 * through.
 * @internal
 */
export function readThemeCategoricalPalette(
  styles: CSSStyleDeclaration,
): string[] {
  return Array.from({ length: 8 }, (_, index) =>
    readThemeCssString(styles, `--sky-color-viz-category-${index + 1}`),
  );
}
