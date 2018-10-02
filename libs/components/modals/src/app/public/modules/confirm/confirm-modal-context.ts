import {
  SkyConfirmConfig,
  SkyConfirmType,
  SkyConfirmButtonConfig
} from './types';

/* istanbul ignore next */
export class SkyConfirmModalContext implements SkyConfirmConfig {
  public message: string;
  public body: string;
  public buttons: SkyConfirmButtonConfig[];
  public type: SkyConfirmType;
}
