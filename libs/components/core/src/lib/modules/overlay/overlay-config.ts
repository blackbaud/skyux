export interface SkyOverlayConfig {
  /**
   * Whether the overlay closes after a navigation change.
   */
  closeOnNavigation?: boolean;

  /**
   * Whether the overlay closes when a user clicks outside the overlay's content.
   */
  enableClose?: boolean;

  /**
   * Whether mouse interactions are allowed below the backdrop.
   */
  enablePointerEvents?: boolean;

  /**
   * Whether window scrolling is enabled when the overlay is opened.
   */
  enableScroll?: boolean;

  /**
   * Whether the overlay's backdrop is visible.
   */
  showBackdrop?: boolean;

  /**
   * Extra CSS classes to add to the overlay's wrapper element.
   */
  wrapperClass?: string;
}
