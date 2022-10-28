import { SkyProgressIndicatorItemStatusType } from './progress-indicator-item-status-type';

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
  itemStatuses?: SkyProgressIndicatorItemStatusType[];
}
