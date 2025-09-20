import { EnvironmentInjector } from '@angular/core';

import { SkyOverlayPosition } from './overlay-position';

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
   * The environment injector for the overlay component.
   */
  environmentInjector?: EnvironmentInjector;

  /**
   * Whether the overlay's backdrop is visible.
   */
  showBackdrop?: boolean;

  /**
   * Extra CSS classes to add to the overlay's wrapper element.
   */
  wrapperClass?: string;

  /**
   * The position of the overlay instance.
   */
  position?: SkyOverlayPosition;

  /**
   * Hides the overlay's siblings from screen readers so users can't interact
   * with content behind the overlay with assistive technology.
   */
  hideOthersFromScreenReaders?: boolean;
}
