export interface SkyOverlayConfig {
  /**
   * If the overlay should be closed after a navigation change.
   */
  closeOnNavigation?: boolean;

  /**
   * If the overlay should be closed when a user clicks outside the overlay's content.
   */
  enableClose?: boolean;

  /**
   * If mouse interactions should be allowed below the backdrop.
   */
  enablePointerEvents?: boolean;

  /**
   * If window scrolling should be enabled when the overlay is opened.
   */
  enableScroll?: boolean;

  /**
   * If the overlay's backdrop should be visible.
   */
  showBackdrop?: boolean;

  /**
   * Extra CSS classes to be added to the overlay's wrapper element.
   */
  wrapperClass?: string;
}
