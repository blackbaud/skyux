import {
  SkyProgressIndicatorMessageType
} from './progress-indicator-message-type';

export interface SkyProgressIndicatorMessage {
  type: SkyProgressIndicatorMessageType;

  data?: {
    /**
     * Used in conjunction with SkyProgressIndicatorMessageType.GoTo
     * to travel to a specific step by specifying an index number.
     */
    activeIndex?: number;

    // Allow any other data to be passed.
    [key: string]: any;
  };
}
