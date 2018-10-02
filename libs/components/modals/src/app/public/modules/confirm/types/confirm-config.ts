import { SkyConfirmType } from './confirm-type';
import { SkyConfirmButtonConfig } from './confirm-button-config';

export interface SkyConfirmConfig {
  message: string;
  body?: string;
  buttons?: SkyConfirmButtonConfig[];
  type?: SkyConfirmType;
}
