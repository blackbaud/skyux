/**
 * Applies a sort to a `SkyDataGrid` and reflects updates when the grid's sort changes.
 * @preview
 */
export interface SkyDataGridSort<
  T extends Record<'id', string> = Record<'id', string> &
    Record<string, string>,
> {
  /**
   * Direction of the sort.
   */
  direction: 'asc' | 'desc';
  /**
   * The data property to sort by.
   * @required
   */
  field: keyof T | (string & {});
}
