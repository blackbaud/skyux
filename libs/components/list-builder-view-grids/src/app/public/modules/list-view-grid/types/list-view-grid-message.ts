import {
  SkyListViewGridMessageType
} from './list-view-grid-message-type';

/**
 * Message for communicating commands to the list view grid
 */
export interface SkyListViewGridMessage {
  /**
   * The type of message being sent
   */
  type: SkyListViewGridMessageType;

  /**
   * The data need to carry out the command
   */
  data?: {
    abortDeleteRow?: {
      id: string;
    },
    promptDeleteRow?: {
      id: string;
    }
  };
}
