/**
 * @internal
 */
export function sortByStackOrder(a: any, b: any): number {
  if (a.stackOrder > b.stackOrder) {
    return -1;
  }

  if (a.stackOrder < b.stackOrder) {
    return 1;
  }

  return 0;
}
