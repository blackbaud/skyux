import { SkyProgressIndicatorItemStatus } from './progress-indicator-item-status';

export interface SkyProgressIndicatorChange {
  /**
   * The active item.
   */
  activeIndex?: number;

  /**
   * Whether the progress indicator is complete.
   */
  isComplete?: boolean;

  /**
   * An array with the status of each item.
   */
  itemStatuses?: SkyProgressIndicatorItemStatus[];
}
