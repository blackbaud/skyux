/**
 * Returns `true` if CSS transitions are enabled on the given element based on
 * the computed value of `--sky-theme-animations-transition-duration`. The
 * value is set to `none` when animations are globally disabled (e.g. via the
 * `sky-theme-animations-disabled` class on the document body).
 */
export function skyAnimationsEnabled(element: Element): boolean {
  return (
    getComputedStyle(element)
      .getPropertyValue('--sky-theme-animations-transition-duration')
      .trim() !== 'none'
  );
}
