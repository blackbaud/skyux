import { SkyListViewGridMessageType } from './list-view-grid-message-type';

/**
 * Communicates commands to the list view grid.
 * @deprecated
 */
export interface SkyListViewGridMessage {
  /**
   * The type of message to send.
   */
  type: SkyListViewGridMessageType;

  /**
   * The data required to carry out the command.
   */
  data?: {
    abortDeleteRow?: {
      id: string;
    };
    promptDeleteRow?: {
      id: string;
    };
  };
}
