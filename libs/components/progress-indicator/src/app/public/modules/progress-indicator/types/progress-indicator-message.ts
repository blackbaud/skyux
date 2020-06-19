import {
  SkyProgressIndicatorMessageType
} from './progress-indicator-message-type';

export interface SkyProgressIndicatorMessage {

  /**
   * Indicates the type of state change for the progress indicator.
   */
  type: SkyProgressIndicatorMessageType;

  /**
   * Used in conjunction with SkyProgressIndicatorMessageType.GoTo
   * to travel to a specific step by specifying an index number on the `data.activeIndex` property.
   */
  data?: {
    activeIndex?: number;

    // Allow any other data to be passed.
    [key: string]: any;
  };
}
