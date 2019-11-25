import {
  SkyTileDashboardMessageType
} from './tile-dashboard-message-type';

/**
 * Specifies the messages to be sent to the tile dashboard component.
 */
export interface SkyTileDashboardMessage {

  /**
   * The type of message to send.
   */
  type?: SkyTileDashboardMessageType;

}
