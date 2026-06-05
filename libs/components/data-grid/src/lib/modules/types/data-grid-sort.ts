/**
 * Used for applying sort to a `SkyDataGridComponent` as well as receiving updates when the data grid sorting changes.
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
