/**
 * Whether CSS animations or transitions are enabled on the given element.
 */
export function skyAnimationsEnabled(element: Element): boolean {
  return (
    getComputedStyle(element)
      .getPropertyValue('--sky-theme-animations-duration')
      .trim() !== '0s'
  );
}
