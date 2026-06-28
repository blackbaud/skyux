/**
 * Applies a sort to a `SkyDataGrid` and reflects updates when the grid's sort changes.
 * @preview
 */
export interface SkyDataGridSort {
  /**
   * Direction of the sort.
   * @required
   */
  direction: 'asc' | 'desc';
  /**
   * The data property to sort by.
   * @required
   */
  field: string;
}
