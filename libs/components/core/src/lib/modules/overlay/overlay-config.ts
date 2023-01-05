export interface SkyOverlayConfig {
  /**
   * Whether the overlay should be closed after a navigation change.
   */
  closeOnNavigation?: boolean;

  /**
   * Whether the overlay should be closed when a user clicks outside the overlay's content.
   */
  enableClose?: boolean;

  /**
   * Whether mouse interactions should be allowed below the backdrop.
   */
  enablePointerEvents?: boolean;

  /**
   * Whether window scrolling should be enabled when the overlay is opened.
   */
  enableScroll?: boolean;

  /**
   * Whether the overlay's backdrop should be visible.
   */
  showBackdrop?: boolean;

  /**
   * Extra CSS classes to be added to the overlay's wrapper element.
   */
  wrapperClass?: string;
}
