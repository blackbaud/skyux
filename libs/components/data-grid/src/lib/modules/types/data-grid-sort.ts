/**
 * Applies a sort to a `SkyDataGrid` and reflects updates when the grid's sort changes.
 */
export interface SkyDataGridSort<
  T extends Record<'id', string> = Record<'id', string> &
    Record<string, string>,
> {
  /**
   * Whether to apply the sort in descending order.
   */
  descending?: boolean;
  /**
   * The data property to sort by.
   * @required
   */
  fieldSelector: keyof T;
}
