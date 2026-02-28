/**
 * Returns `true` if CSS animations and transitions are enabled on the given
 * element based on the computed value of `--sky-theme-animations-duration`.
 * The value is set to `0s` when animations are globally disabled (e.g. via
 * the `sky-theme-animations-disabled` class on the document body).
 */
export function skyAnimationsEnabled(element: Element): boolean {
  return (
    getComputedStyle(element)
      .getPropertyValue('--sky-theme-animations-duration')
      .trim() !== '0s'
  );
}
