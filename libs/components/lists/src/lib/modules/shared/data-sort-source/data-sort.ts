/**
 * Describes how a component sorts its data.
 * @internal
 */
export interface SkyDataSort {
  /**
   * The direction of the sort.
   * @required
   */
  direction: 'asc' | 'desc';
  /**
   * The field or column ID to sort by.
   * @required
   */
  field: string;
}
