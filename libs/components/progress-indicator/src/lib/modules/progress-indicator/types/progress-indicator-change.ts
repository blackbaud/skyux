import { SkyProgressIndicatorItemStatus } from './progress-indicator-item-status';

export interface SkyProgressIndicatorChange {
  /**
   * Specifies the active item.
   */
  activeIndex?: number;

  /**
   * Indicates whether the progress indicator is complete.
   */
  isComplete?: boolean;

  /**
   * Specifies an array with the status of each item.
   */
  itemStatuses?: SkyProgressIndicatorItemStatus[];
}
