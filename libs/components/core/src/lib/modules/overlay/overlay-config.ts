export interface SkyOverlayConfig {
  /**
   * Specifies if the overlay should be closed after a navigation change.
   */
  closeOnNavigation?: boolean;

  /**
   * Specifies if the overlay should be closed when a user clicks outside the overlay's content.
   */
  enableClose?: boolean;

  /**
   * Specifies if mouse interactions should be allowed below the backdrop.
   */
  enablePointerEvents?: boolean;

  /**
   * Specifies if window scrolling should be enabled when the overlay is opened.
   */
  enableScroll?: boolean;

  /**
   * Specifies if the overlay's backdrop should be visible.
   */
  showBackdrop?: boolean;

  /**
   * Specifies extra CSS classes to be added to the overlay's wrapper element.
   */
  wrapperClass?: string;
}
