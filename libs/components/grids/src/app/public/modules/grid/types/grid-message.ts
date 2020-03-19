import {
  SkyGridMessageType
} from './grid-message-type';

export interface SkyGridMessage {
  type: SkyGridMessageType;
  data?: {
    abortDeleteRow?: {
      id: string;
    },
    promptDeleteRow?: {
      id: string;
    }
  };
}
