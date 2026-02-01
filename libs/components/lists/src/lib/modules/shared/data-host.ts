/**
 * Represents data state for components that can integrate with a data manager.
 * This interface provides a standard way for data-displaying components (like data grids)
 * to communicate their state with data management systems.
 */
export interface SkyDataHost {
  /**
   * The IDs or fields for columns to display.
   */
  displayedColumnIds?: string[];

  /**
   * The field selector and direction for sorting.
   */
  sort?: {
    /**
     * The field to sort by.
     */
    fieldSelector: string;
    /**
     * Whether to sort in descending order.
     */
    descending: boolean;
  };

  /**
   * The current page number (1-based).
   */
  page?: number;

  /**
   * The set of IDs for selected rows or items.
   */
  selectedIds?: string[];
}
