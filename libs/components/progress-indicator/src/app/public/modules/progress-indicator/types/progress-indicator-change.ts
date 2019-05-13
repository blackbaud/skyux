import {
  SkyProgressIndicatorItemStatus
} from './progress-indicator-item-status';

export interface SkyProgressIndicatorChange {

  activeIndex?: number;

  isComplete?: boolean;

  itemStatuses?: SkyProgressIndicatorItemStatus[];
}
