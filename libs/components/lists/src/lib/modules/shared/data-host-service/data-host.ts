/**
 * Represents data state for components that can integrate with a data manager.
 * This interface provides a standard way for data-displaying components (like data grids)
 * to communicate their state with data management systems.
 * @internal
 */
export interface SkyDataHost {
  /**
   * The data property and direction for sorting.
   */
  activeSortOption:
    | {
        /**
         * The data property to sort by.
         * @required
         */
        propertyName: string;
        /**
         * Whether to apply the sort in descending order.
         * @required
         */
        descending: boolean;
      }
    | undefined;

  /**
   * The IDs or fields for columns to display.
   */
  displayedColumnIds: string[];

  /**
   * An identifier for the data host.
   */
  id: string;

  /**
   * The current page number (1-based).
   */
  page: number | undefined;

  /**
   * The search text to apply.
   */
  searchText: string | undefined;

  /**
   * The currently selected rows or objects.
   */
  selectedIds: string[] | undefined;
}
