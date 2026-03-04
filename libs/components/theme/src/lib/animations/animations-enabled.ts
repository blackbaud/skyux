/**
 * Whether CSS animations or transitions are enabled on the given element.
 */
export function skyAnimationsEnabled(element: Element): boolean {
  return (
    getComputedStyle(element)
      .getPropertyValue('--sky-transition-time-short')
      .trim() !== '0s'
  );
}
