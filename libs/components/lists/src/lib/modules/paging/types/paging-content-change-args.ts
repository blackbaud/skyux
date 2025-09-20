/**
 * Information about the paged content to load.
 */
export interface SkyPagingContentChangeArgs {
  /**
   * The current page number.
   */
  currentPage: number;

  /**
   * A function to call when loading the paged content completes.
   */
  loadingComplete: () => void;
}
